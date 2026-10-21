import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
const OK = ["pending", "paid", "shipped", "delivered", "cancelled"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { status } = await req.json().catch(() => ({}));
  if (!OK.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  db().prepare("UPDATE orders SET status=? WHERE id=?").run(status, Number(params.id));
  return NextResponse.json({ ok: true });
}
