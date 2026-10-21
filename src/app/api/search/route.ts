import { NextResponse } from "next/server";
import { search } from "@/lib/queries";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim().slice(0, 120);
  if (!q) return NextResponse.json({ items: [], total: 0 });
  const result = search({ q }, 6);
  return NextResponse.json({ items: result.items.map(p => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] || null, category: p.category })), total: result.total }, { headers: { "Cache-Control": "no-store" } });
}
