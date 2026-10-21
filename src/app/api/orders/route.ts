import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const items: { productId: number; qty: number; color?: string; size?: string }[] = Array.isArray(b.items) ? b.items : [];
  const ship = { name: String(b.name || "").trim(), phone: String(b.phone || "").trim(), address: String(b.address || "").trim(), city: String(b.city || "").trim() };
  if (!items.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (!ship.name || !ship.phone || !ship.address || !ship.city) return NextResponse.json({ error: "Fill in all delivery fields." }, { status: 400 });

  const d = db();
  const get = d.prepare("SELECT id,name,price,old_price,stock FROM products WHERE id=? AND active=1");
  const lines: any[] = []; let subtotal = 0, discount = 0;
  for (const it of items) {
    const p = get.get(it.productId) as any; const qty = Math.max(1, Math.min(20, Number(it.qty) || 1));
    if (!p) return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
    if (p.stock < qty) return NextResponse.json({ error: `Only ${p.stock} left of ${p.name}.` }, { status: 400 });
    lines.push({ p, qty, color: it.color || null, size: it.size || null });
    subtotal += (p.old_price || p.price) * qty; discount += ((p.old_price || p.price) - p.price) * qty;
  }
  const net = subtotal - discount; const delivery = net > 0 && net < 150 ? 9 : 0; const total = net + delivery;
  const id = d.transaction(() => {
    const r = d.prepare("INSERT INTO orders (user_id,subtotal,discount,delivery,total,ship_name,ship_phone,ship_address,ship_city) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(u.id, subtotal, discount, delivery, total, ship.name, ship.phone, ship.address, ship.city);
    const oid = Number(r.lastInsertRowid);
    for (const l of lines) {
      d.prepare("INSERT INTO order_items (order_id,product_id,name,price,qty,color,size) VALUES (?,?,?,?,?,?,?)").run(oid, l.p.id, l.p.name, l.p.price, l.qty, l.color, l.size);
      d.prepare("UPDATE products SET stock=stock-? WHERE id=?").run(l.qty, l.p.id);
    }
    return oid;
  })();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id });
}
