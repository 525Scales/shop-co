import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { newsletterEmail } from "@/lib/emailTemplates";
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!/^\S+@\S+\.\S+$/.test(String(email || ""))) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const address = String(email).trim().toLowerCase();
  const inserted = db().prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").run(address);
  if (inserted.changes) {
    try {
      const message = newsletterEmail();
      await sendMail(address, message.subject, message.text, message.html);
    } catch {
      db().prepare("DELETE FROM subscribers WHERE email=?").run(address);
      return NextResponse.json({ error: "We could not send your welcome email. Please try again later." }, { status: 503 });
    }
  }
  return NextResponse.json({ ok: true });
}
