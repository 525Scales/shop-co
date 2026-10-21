import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductBuy from "@/components/ProductBuy";
import ProductTabs from "@/components/ProductTabs";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";
import { allProducts, getProduct, related, reviewsFor } from "@/lib/queries";
import { discountPct, money } from "@/lib/utils";

export const revalidate = 60;
export const generateStaticParams = () => allProducts().filter((p) => p.active).map((p) => ({ slug: p.slug }));

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p || !p.active) notFound();
  const off = discountPct(p.price, p.oldPrice);
  const thumbs = p.images.length > 1 ? p.images.slice(0, 3).map((_, i) => i) : [0, 1, 2];
  return (
    <div className="container-x">
      <nav className="py-5 text-sm text-black/60"><Link href="/">Home</Link> &rsaquo; <Link href="/shop">Shop</Link> &rsaquo; <Link href={`/shop?category=${p.category}`} className="capitalize">{p.category}</Link></nav>
      <div className="grid gap-5 md:gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
          <div className="grid grid-cols-3 gap-3 md:w-[152px] md:grid-cols-1 md:gap-4">{thumbs.map((i) => <ProductImage key={i} p={p} i={i} className="!rounded-[14px] md:!rounded-[20px]" />)}</div>
          <div className="flex-1"><ProductImage p={p} className="!aspect-[4/4.2] md:!aspect-[1/1.1]" /></div>
        </div>
        <div>
          <h1 className="font-display text-[30px] leading-[1.05] md:text-[40px]">{p.name}</h1>
          <div className="mt-3 flex items-center gap-3"><Stars value={p.rating} size={22} /><span className="text-black/60">{p.rating.toFixed(1)}<span className="text-black/35">/5</span></span></div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[28px] font-bold md:text-[32px]">{money(p.price)}
            {p.oldPrice && p.oldPrice > p.price && <><span className="text-black/30 line-through">{money(p.oldPrice)}</span><span className="rounded-full bg-sale/10 px-3.5 py-1.5 text-base font-medium text-sale">-{off}%</span></>}</div>
          <p className="mt-4 mb-5 leading-relaxed text-black/60">{p.description}</p>
          <ProductBuy p={p} />
          <p className="mt-4 text-sm text-black/50">{p.stock > 0 ? (p.stock < 10 ? `Only ${p.stock} left in stock` : "In stock") : "Currently unavailable"}</p>
        </div>
      </div>
      <ProductTabs p={p} reviews={reviewsFor(p.id)} />
      <section className="mt-16 md:mt-20"><h2 className="text-center font-display text-[32px] md:text-[48px]">You might also like</h2>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 md:mx-0 md:mt-12 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {related(p.id).map((r) => <div key={r.id} className="w-[62%] shrink-0 md:w-auto"><ProductCard p={r} /></div>)}</div></section>
    </div>
  );
}
