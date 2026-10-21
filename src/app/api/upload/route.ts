import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";

const ALLOWED: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const f = (await req.formData()).get("file");
  if (!(f instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
  const ext = ALLOWED[f.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (f.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  const name = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
