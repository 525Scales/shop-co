import Link from "next/link";
import { Suspense } from "react";
import ShopFilters from "@/components/ShopFilters";
import SortSelect from "@/components/SortSelect";
import ProductCard from "@/components/ProductCard";
import { search } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
type SP = Record<string, string | undefined>;

export default function Shop({ searchParams: sp }: { searchParams: SP }) {
  const r = search({ style: sp.style, category: sp.category, max: sp.max ? Number(sp.max) : undefined, color: sp.color, size: sp.size, sale: sp.sale === "1", sort: sp.sort, page: Number(sp.page) || 1, q: sp.q });
  const title = sp.q ? `Results for "${sp.q}"` : sp.sale ? "On Sale" : sp.style ? sp.style : sp.category ? sp.category : "All Products";
  const href = (p: number) => { const n = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]); n.set("page", String(p)); return `/shop?${n}`; };
  const from = r.total ? (r.page - 1) * 9 + 1 : 0, to = Math.min(r.total, r.page * 9);
  return (
    <div className="container-x pb-4">
      <nav className="py-5 text-sm text-black/60"><Link href="/">Home</Link> <span className="mx-1.5">&rsaquo;</span> <span className="text-ink">{title}</span></nav>
      <div className="flex gap-5">
        <Suspense><ShopFilters /></Suspense>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
            <div className="flex items-baseline gap-3"><h1 className="font-display text-[28px] capitalize md:text-[32px]">{title}</h1></div>
            <div className="flex items-center gap-3"><span className="hidden text-sm text-black/60 sm:inline">Showing {from}-{to} of {r.total} Products</span><Suspense><SortSelect /></Suspense></div>
          </div>
          {r.items.length === 0 ? (
            <div className="rounded-[20px] bg-paper px-6 py-20 text-center"><p className="text-xl font-bold">No products match these filters</p><p className="mt-2 text-black/60">Try removing a filter or searching for something else.</p><Link href="/shop" className="pill pill-dark mt-6">Clear filters</Link></div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10">{r.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          )}
          {r.pages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 text-sm">
              {r.page > 1 ? <Link href={href(r.page - 1)} className="pill pill-light !py-2.5">Previous</Link> : <span />}
              <div className="flex gap-1">{Array.from({ length: r.pages }, (_, i) => i + 1).map((n) => <Link key={n} href={href(n)} className={cn("grid h-10 w-10 place-items-center rounded-lg", n === r.page ? "bg-paper font-bold" : "text-black/50 hover:bg-paper")}>{n}</Link>)}</div>
              {r.page < r.pages ? <Link href={href(r.page + 1)} className="pill pill-light !py-2.5">Next</Link> : <span />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
