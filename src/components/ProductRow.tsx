import Link from "next/link";
import type { Product } from "@/lib/queries";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function ProductRow({ title, items, href, first }: { title: string; items: Product[]; href: string; first?: boolean }) {
  return (
    <section className={`container-x ${first ? "mt-14 md:mt-[72px]" : "mt-14 md:mt-[72px]"}`}>
      <Reveal><h2 className="text-center font-display text-[32px] md:text-[48px]">{title}</h2></Reveal>
      {items.length === 0 ? (
        <p className="mt-10 rounded-[20px] bg-paper p-10 text-center text-black/60">Nothing here yet. Mark products as &ldquo;{title}&rdquo; from the admin panel.</p>
      ) : (
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:mt-14 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {items.map((p, i) => <Reveal key={p.id} delay={i * 0.07} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto"><ProductCard p={p} /></Reveal>)}
        </div>
      )}
      <div className="mt-8 text-center md:mt-14"><Link href={href} className="pill pill-light w-full md:w-auto md:px-16">View All</Link></div>
    </section>
  );
}
