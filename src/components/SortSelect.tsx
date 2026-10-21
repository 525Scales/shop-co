"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
export default function SortSelect() {
  const sp = useSearchParams(), router = useRouter(), path = usePathname();
  return (
    <label className="flex items-center gap-1 text-sm text-black/60">Sort by:
      <select value={sp.get("sort") || "new"} onChange={(e) => { const n = new URLSearchParams(sp.toString()); n.set("sort", e.target.value); n.delete("page"); router.push(`${path}?${n}`); }} className="bg-transparent font-medium text-ink outline-none">
        <option value="new">Newest</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
      </select>
    </label>
  );
}
