import Link from "next/link";
import type { Product } from "@/lib/queries";
import ProductImage from "./ProductImage";
import Stars from "./Stars";
import { discountPct, money } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  const off = discountPct(p.price, p.oldPrice);
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="overflow-hidden rounded-[20px]">
        <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"><ProductImage p={p} /></div>
      </div>
      <h3 className="mt-4 text-base font-bold leading-snug md:text-xl">{p.name}</h3>
      <div className="mt-1.5 flex items-center gap-2 text-sm">
        <Stars value={p.rating} size={17} /><span className="text-black/60">{p.rating.toFixed(1)}<span className="text-black/35">/5</span></span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xl font-bold md:text-2xl">
        {money(p.price)}
        {p.oldPrice && p.oldPrice > p.price && (<>
          <span className="text-xl text-black/30 line-through md:text-2xl">{money(p.oldPrice)}</span>
          <span className="rounded-full bg-sale/10 px-3 py-1 text-xs font-medium text-sale">-{off}%</span>
        </>)}
      </div>
    </Link>
  );
}
