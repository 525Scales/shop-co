import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseProduct } from "@/lib/productInput";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const p = parseProduct(await req.json().catch(() => ({})));
  if ("error" in p) return NextResponse.json(p, { status: 400 });
  db().prepare(`UPDATE products SET name=@name,description=@description,price=@price,old_price=@old_price,category=@category,style=@style,
    device=@device,tint=@tint,colors=@colors,sizes=@sizes,images=@images,stock=@stock,is_new=@is_new,is_top=@is_top,active=@active WHERE id=@id`).run({ ...p.row, id: Number(params.id) });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  db().prepare("DELETE FROM products WHERE id=?").run(Number(params.id));
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
