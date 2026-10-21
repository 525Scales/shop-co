import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { randomInt, createHash } from "node:crypto";
import { sendMail } from "@/lib/mail";
import { verificationEmail } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim(), email = String(b.email || "").trim().toLowerCase(), password = String(b.password || "");
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
  if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });
  if (db().prepare("SELECT 1 FROM users WHERE email=?").get(email)) return NextResponse.json({ errors: { email: "An account with this email already exists." } }, { status: 409 });
  const pending = db().prepare("SELECT sent_at FROM registration_codes WHERE email=?").get(email) as { sent_at: number } | undefined;
  if (pending && Date.now() - pending.sent_at < 60000) return NextResponse.json({ error: "Please wait a minute before requesting another code." }, { status: 429 });
  const code = String(randomInt(100000, 1000000));
  const now = Date.now();
  db().prepare(`INSERT OR REPLACE INTO registration_codes (email,name,password_hash,code_hash,expires_at,sent_at,attempts) VALUES (?,?,?,?,?,?,0)`)
    .run(email, name, bcrypt.hashSync(password, 10), createHash("sha256").update(code).digest("hex"), now + 600000, now);
  try {
    const message = verificationEmail(name, code);
    await sendMail(email, message.subject, message.text, message.html);
  } catch {
    db().prepare("DELETE FROM registration_codes WHERE email=? AND sent_at=?").run(email, now);
    return NextResponse.json({ error: "We could not send your code. Please try again later." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, requiresVerification: true });
}
