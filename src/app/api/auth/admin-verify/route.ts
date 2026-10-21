import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { createSession, type SessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({}));
  const token = cookies().get("shopco_admin_challenge")?.value;
  if (!token) return NextResponse.json({ error: "Please log in again to request an admin code." }, { status: 401 });
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  const user = db().transaction(() => {
    const row = db().prepare(`SELECT c.*,u.name,u.email,u.role,u.disabled,u.session_version AS current_version FROM admin_login_codes c JOIN users u ON u.id=c.user_id WHERE token_hash=?`).get(hash(token)) as { user_id: number; name: string; email: string; role: string; disabled: number; session_version: number; current_version: number; attempts: number; expires_at: number; code_hash: string } | undefined;
    if (!row || row.disabled || row.role !== "admin" || row.session_version !== row.current_version || row.expires_at <= Date.now() || row.attempts >= 5) return null;
    db().prepare("UPDATE admin_login_codes SET attempts=attempts+1 WHERE token_hash=?").run(hash(token));
    if (!/^\d{6}$/.test(String(code)) || hash(String(code)) !== row.code_hash) return null;
    db().prepare("DELETE FROM admin_login_codes WHERE user_id=?").run(row.user_id);
    return { id: row.user_id, name: row.name, email: row.email, role: "admin" } as SessionUser;
  })();
  if (!user) return NextResponse.json({ error: "Invalid or expired code. After five attempts, log in again to request a new code." }, { status: 400 });
  await createSession(user, true);
  cookies().set("shopco_admin_challenge", "", { path: "/api/auth", maxAge: 0 });
  return NextResponse.json({ ok: true, role: "admin" });
}
