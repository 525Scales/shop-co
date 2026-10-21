"use client";
import { useState } from "react";
import { Minus, Plus, Check } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";
import { COLORS, cn } from "@/lib/utils";
import type { Product } from "@/lib/queries";

export default function ProductBuy({ p }: { p: Product }) {
  const [color, setColor] = useState(p.colors[0] || ""), [size, setSize] = useState(p.sizes[0] || ""), [qty, setQty] = useState(1), [done, setDone] = useState(false);
  const { add } = useCart(); const out = p.stock <= 0;
  const go = () => { add({ productId: p.id, slug: p.slug, name: p.name, price: p.price, oldPrice: p.oldPrice, color, size, qty, device: p.device, tint: p.tint, image: p.images[0] }); setDone(true); setTimeout(() => setDone(false), 1600); };
  return (
    <div>
      {p.colors.length > 0 && (<div className="border-t border-black/10 py-5"><p className="mb-4 text-black/60">Select Color</p>
        <div className="flex gap-3">{p.colors.map((c) => <button key={c} aria-label={c} onClick={() => setColor(c)} style={{ background: COLORS[c] || c }} className="grid h-[37px] w-[37px] place-items-center rounded-full ring-1 ring-black/15 transition active:scale-90">{color === c && <Check size={16} weight="bold" className={c === "white" ? "text-ink" : "text-white"} />}</button>)}</div></div>)}
      {p.sizes.length > 0 && (<div className="border-t border-black/10 py-5"><p className="mb-4 text-black/60">Choose Storage</p>
        <div className="flex flex-wrap gap-2.5">{p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={cn("rounded-full px-5 py-3 text-sm transition", size === s ? "bg-ink text-white" : "bg-paper text-black/60 hover:bg-zinc-200")}>{s}</button>)}</div></div>)}
      <div className="flex gap-3 border-t border-black/10 pt-5 md:gap-5">
        <div className="flex items-center justify-between gap-5 rounded-full bg-paper px-5 py-3.5 md:min-w-[170px]">
          <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={20} /></button><span className="w-5 text-center font-medium">{qty}</span><button aria-label="Increase" onClick={() => setQty((q) => Math.min(Math.max(1, p.stock), q + 1))}><Plus size={20} /></button>
        </div>
        <button onClick={go} disabled={out} className="pill pill-dark flex-1">{out ? "Out of stock" : done ? "Added to cart" : "Add to Cart"}</button>
      </div>
    </div>
  );
}
