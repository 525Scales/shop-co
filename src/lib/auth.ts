import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

export type SessionUser = { id: number; name: string; email: string; role: "admin" | "customer" };
const COOKIE = "shopco_session";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-only-secret-change-me-please-32chars");

export async function createSession(u: SessionUser, adminVerified = false) {
  if (u.role === "admin" && !adminVerified) throw new Error("Admin verification required");
  const row = db().prepare("SELECT session_version,disabled FROM users WHERE id=?").get(u.id) as { session_version: number; disabled: number } | undefined;
  if (!row || row.disabled) throw new Error("Account unavailable");
  const token = await new SignJWT({ ...u, version: row.session_version, mfa: adminVerified }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export function destroySession() { cookies().set(COOKIE, "", { path: "/", maxAge: 0 }); }

export async function getUser(): Promise<SessionUser | null> {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, secret());
    const u = db().prepare("SELECT id,name,email,role,disabled,session_version FROM users WHERE id=?").get(payload.id) as (SessionUser & { disabled: number; session_version: number }) | undefined;
    if (!u || u.disabled || (payload.version ?? 0) !== u.session_version || payload.role !== u.role || (u.role === "admin" && payload.mfa !== true)) return null;
    return { id: u.id, name: u.name, email: u.email, role: u.role };
  } catch { return null; }
}
export async function requireAdmin() {
  const u = await getUser();
  return u && u.role === "admin" ? u : null;
}
