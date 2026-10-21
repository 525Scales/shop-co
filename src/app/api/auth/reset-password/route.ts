import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { destroySession } from "@/lib/auth";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase(), code = String(b.code || ""), password = String(b.password || "");
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) return NextResponse.json({ error: "Use at least 8 characters and at most 72 bytes for your password." }, { status: 400 });
  const token = cookies().get("shopco_password_reset")?.value;
  const invalid = () => NextResponse.json({ error: "Invalid or expired code. Request a new code after five unsuccessful attempts, and use the same browser." }, { status: 400 });
  if (!token) return invalid();
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  const changed = db().transaction(() => {
    const row = db().prepare(`SELECT r.*,u.email,u.disabled,u.session_version AS current_version FROM password_reset_codes r JOIN users u ON u.id=r.user_id WHERE r.token_hash=?`).get(hash(token)) as { user_id: number; email: string; disabled: number; session_version: number; current_version: number; expires_at: number; attempts: number; code_hash: string } | undefined;
    if (!row || row.disabled || row.email !== email || row.session_version !== row.current_version || row.expires_at <= Date.now() || row.attempts >= 5) return false;
    db().prepare("UPDATE password_reset_codes SET attempts=attempts+1 WHERE user_id=?").run(row.user_id);
    if (!/^\d{6}$/.test(code) || hash(`${token}:${code}`) !== row.code_hash) return false;
    db().prepare("UPDATE users SET password_hash=?,session_version=session_version+1 WHERE id=?").run(bcrypt.hashSync(password, 12), row.user_id);
    db().prepare("DELETE FROM password_reset_codes WHERE user_id=?").run(row.user_id);
    db().prepare("DELETE FROM admin_login_codes WHERE user_id=?").run(row.user_id);
    return true;
  })();
  if (!changed) return invalid();
  destroySession();
  cookies().set("shopco_password_reset", "", { path: "/api/auth", maxAge: 0 });
  cookies().set("shopco_admin_challenge", "", { path: "/api/auth", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
