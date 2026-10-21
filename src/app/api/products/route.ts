import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { parseProduct } from "@/lib/productInput";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const p = parseProduct(await req.json().catch(() => ({})));
  if ("error" in p) return NextResponse.json(p, { status: 400 });
  let slug = slugify(p.row.name), n = 1;
  while (db().prepare("SELECT 1 FROM products WHERE slug=?").get(slug)) slug = `${slugify(p.row.name)}-${++n}`;
  const r = db().prepare(`INSERT INTO products (slug,name,description,price,old_price,category,style,device,tint,colors,sizes,images,stock,is_new,is_top,active)
    VALUES (@slug,@name,@description,@price,@old_price,@category,@style,@device,@tint,@colors,@sizes,@images,@stock,@is_new,@is_top,@active)`).run({ ...p.row, slug });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id: r.lastInsertRowid });
}
