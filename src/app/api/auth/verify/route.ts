import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const code = String(b.code || "");
  const result = db().transaction(() => {
    const row = db().prepare("SELECT * FROM registration_codes WHERE email=?").get(email) as { name: string; password_hash: string; code_hash: string; expires_at: number; attempts: number } | undefined;
    if (!row || row.expires_at < Date.now() || row.attempts >= 5) return null;
    db().prepare("UPDATE registration_codes SET attempts=attempts+1 WHERE email=?").run(email);
    if (!/^\d{6}$/.test(code) || createHash("sha256").update(code).digest("hex") !== row.code_hash) return null;
    if (db().prepare("SELECT 1 FROM users WHERE email=?").get(email)) return null;
    const r = db().prepare("INSERT INTO users (name,email,password_hash) VALUES (?,?,?)").run(row.name, email, row.password_hash);
    db().prepare("DELETE FROM registration_codes WHERE email=?").run(email);
    return { id: Number(r.lastInsertRowid), name: row.name, email, role: "customer" as const };
  })();
  if (!result) return NextResponse.json({ error: "Invalid or expired code. Request a new code after five unsuccessful attempts." }, { status: 400 });
  await createSession(result);
  return NextResponse.json({ ok: true });
}
