import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Log in to write a review." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const rating = Math.round(Number(b.rating)), body = String(b.body || "").trim();
  if (!(rating >= 1 && rating <= 5) || body.length < 10) return NextResponse.json({ error: "Add a rating and at least 10 characters." }, { status: 400 });
  db().prepare("INSERT INTO reviews (product_id,user_id,author,rating,body) VALUES (?,?,?,?,?)").run(Number(b.productId), u.id, u.name, rating, body);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
