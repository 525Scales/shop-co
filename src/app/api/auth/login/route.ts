import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { randomBytes, randomInt, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { sendMail } from "@/lib/mail";
import { adminLoginEmail } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  const u = db().prepare("SELECT * FROM users WHERE email=?").get(String(email).trim().toLowerCase()) as any;
  if (!u || u.disabled || !bcrypt.compareSync(String(password), u.password_hash))
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  if (u.role === "admin") {
    const now = Date.now();
    db().prepare("DELETE FROM admin_login_codes WHERE expires_at<?").run(now);
    const recent = db().prepare("SELECT 1 FROM admin_login_codes WHERE user_id=? AND sent_at>? LIMIT 1").get(u.id, now - 60000);
    if (recent) return NextResponse.json({ error: "Please wait one minute before requesting another admin code." }, { status: 429 });
    const token = randomBytes(32).toString("hex"), code = String(randomInt(100000, 1000000));
    const hash = (s: string) => createHash("sha256").update(s).digest("hex");
    db().prepare("INSERT INTO admin_login_codes (token_hash,user_id,code_hash,expires_at,sent_at,session_version) VALUES (?,?,?,?,?,?)").run(hash(token), u.id, hash(code), now + 600000, now, u.session_version);
    try {
      const message = adminLoginEmail(u.name, code);
      await sendMail(u.email, message.subject, message.text, message.html);
    } catch {
      db().prepare("DELETE FROM admin_login_codes WHERE token_hash=?").run(hash(token));
      return NextResponse.json({ error: "Could not send your admin code. Please try again later." }, { status: 503 });
    }
    cookies().set("shopco_admin_challenge", token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/api/auth", maxAge: 600 });
    return NextResponse.json({ ok: true, requiresVerification: true, verificationType: "admin" });
  }
  await createSession({ id: u.id, name: u.name, email: u.email, role: u.role });
  return NextResponse.json({ ok: true, role: u.role });
}
