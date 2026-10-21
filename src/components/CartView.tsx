"use client";
import Link from "next/link";
import { Minus, Plus, Trash, ArrowRight } from "@phosphor-icons/react";
import { keyOf, useCart } from "./CartProvider";
import ProductImage from "./ProductImage";
import { money } from "@/lib/utils";

export const totals = (items: { price: number; oldPrice: number | null; qty: number }[]) => {
  const subtotal = items.reduce((s, i) => s + (i.oldPrice || i.price) * i.qty, 0);
  const discount = items.reduce((s, i) => s + ((i.oldPrice || i.price) - i.price) * i.qty, 0);
  const net = subtotal - discount; const delivery = net > 0 && net < 150 ? 9 : 0;
  return { subtotal, discount, delivery, total: net + delivery };
};

export function Summary({ cta }: { cta?: React.ReactNode }) {
  const { items } = useCart(); const t = totals(items);
  const Row = ({ l, v, red }: { l: string; v: string; red?: boolean }) => <div className="flex justify-between text-base md:text-xl"><span className="text-black/60">{l}</span><span className={`font-bold ${red ? "text-sale" : ""}`}>{v}</span></div>;
  return (
    <div className="h-fit rounded-[20px] p-5 ring-1 ring-black/10 md:p-6">
      <h2 className="text-xl font-bold md:text-2xl">Order Summary</h2>
      <div className="mt-5 space-y-4"><Row l="Subtotal" v={money(t.subtotal)} />{t.discount > 0 && <Row l="Discount" v={`-${money(t.discount)}`} red />}<Row l="Delivery Fee" v={t.delivery ? money(t.delivery) : "Free"} />
        <div className="border-t border-black/10 pt-4"><div className="flex justify-between text-lg md:text-xl"><span>Total</span><span className="text-xl font-bold md:text-2xl">{money(t.total)}</span></div></div></div>
      {cta}
    </div>
  );
}

export default function CartView() {
  const { items, ready, setQty, remove } = useCart();
  if (!ready) return <div className="skeleton h-72 rounded-[20px]" />;
  if (!items.length) return (
    <div className="rounded-[20px] bg-paper px-6 py-20 text-center"><p className="text-2xl font-bold">Your cart is empty</p><p className="mt-2 text-black/60">Add a few pieces and they will show up here.</p><Link href="/shop" className="pill pill-dark mt-6">Start shopping</Link></div>
  );
  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      <ul className="divide-y divide-black/10 rounded-[20px] px-4 ring-1 ring-black/10 md:px-6">
        {items.map((i) => { const k = keyOf(i); return (
          <li key={k} className="flex gap-4 py-5 md:gap-5 md:py-6">
            <Link href={`/product/${i.slug}`} className="w-24 shrink-0 md:w-[124px]"><ProductImage p={{ images: i.image ? [i.image] : [], device: i.device, tint: i.tint, name: i.name }} className="!rounded-[10px] md:!rounded-[8px]" /></Link>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-2"><div><h3 className="text-base font-bold md:text-xl">{i.name}</h3>{i.size && <p className="mt-1 text-sm">Storage: <span className="text-black/60">{i.size}</span></p>}{i.color && <p className="text-sm">Color: <span className="capitalize text-black/60">{i.color}</span></p>}</div>
                <button aria-label={`Remove ${i.name}`} onClick={() => remove(k)} className="h-fit text-sale transition active:scale-90"><Trash size={22} /></button></div>
              <div className="mt-3 flex items-center justify-between"><span className="text-xl font-bold md:text-2xl">{money(i.price)}</span>
                <div className="flex items-center gap-4 rounded-full bg-paper px-4 py-2.5"><button aria-label="Decrease" onClick={() => setQty(k, i.qty - 1)}><Minus size={18} /></button><span className="w-4 text-center text-sm font-medium">{i.qty}</span><button aria-label="Increase" onClick={() => setQty(k, i.qty + 1)}><Plus size={18} /></button></div></div>
            </div>
          </li>); })}
      </ul>
      <Summary cta={<Link href="/checkout" className="pill pill-dark mt-6 w-full">Go to Checkout <ArrowRight size={18} /></Link>} />
    </div>
  );
}
