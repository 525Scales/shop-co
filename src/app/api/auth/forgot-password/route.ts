import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes, randomInt, createHash } from "node:crypto";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { passwordResetEmail } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const d = db(), now = Date.now();
  d.prepare("DELETE FROM password_reset_codes WHERE expires_at<=?").run(now);
  const user = d.prepare("SELECT id,name,email,session_version FROM users WHERE email=? AND disabled=0").get(email) as { id: number; name: string; email: string; session_version: number } | undefined;
  // Identical responses for unknown, disabled and rate-limited accounts.
  const token = randomBytes(32).toString("hex");
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  const code = String(randomInt(100000, 1000000));
  const inserted = user ? d.prepare(`INSERT INTO password_reset_codes (user_id,token_hash,code_hash,expires_at,sent_at,session_version)
    VALUES (?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET token_hash=excluded.token_hash,code_hash=excluded.code_hash,
    expires_at=excluded.expires_at,sent_at=excluded.sent_at,session_version=excluded.session_version,attempts=0
    WHERE password_reset_codes.sent_at<=?`).run(user.id, hash(token), hash(`${token}:${code}`), now + 600000, now, user.session_version, now - 60000).changes : 0;
  if (user && inserted) {
    try {
      const message = passwordResetEmail(user.name, code);
      await sendMail(user.email, message.subject, message.text, message.html);
    } catch {
      d.prepare("DELETE FROM password_reset_codes WHERE token_hash=?").run(hash(token));
      console.error("Password reset email delivery failed.");
    }
  }
  // Keep the current challenge during a cooldown so an already received code still works.
  if (inserted || !cookies().get("shopco_password_reset")?.value) cookies().set("shopco_password_reset", token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/api/auth", maxAge: 600 });
  return NextResponse.json({ ok: true, message: "If an active account exists for this email, a reset code will be sent. Check your inbox and spam folder." });
}
