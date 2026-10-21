"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { money } from "@/lib/utils";

type Suggestion = { id: number; slug: string; name: string; price: number; image: string | null; category: string };
export default function ProductSearch({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const [q, setQ] = useState(""), [open, setOpen] = useState(false), [items, setItems] = useState<Suggestion[]>([]), [busy, setBusy] = useState(false), [error, setError] = useState(false), [total, setTotal] = useState(0), [selected, setSelected] = useState(-1);
  const id = useId(), router = useRouter();
  const query = q.trim();
  useEffect(() => {
    setItems([]); setTotal(0); setSelected(-1); setError(false);
    if (!query) { setBusy(false); return; }
    const controller = new AbortController(); setBusy(true);
    const timer = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal, cache: "no-store" });
        if (!r.ok) throw new Error("Search failed");
        const data = await r.json();
        if (!controller.signal.aborted) { setItems(data.items); setTotal(data.total); }
      } catch { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setBusy(false); }
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const visible = open && !!query;
  const navigate = (url: string) => { setOpen(false); onNavigate?.(); router.push(url); };
  return <form role="search" onSubmit={e => { e.preventDefault(); navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop"); }} className={`relative ${className}`} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
    <MagnifyingGlass size={20} className="pointer-events-none absolute left-4 top-[17px] text-black/40" />
    <input role="combobox" aria-label="Search products" aria-autocomplete="list" aria-expanded={visible} aria-controls={visible ? `${id}-results` : undefined} aria-activedescendant={visible && selected >= 0 ? `${id}-item-${selected}` : undefined} autoComplete="off" value={q} maxLength={120} onFocus={() => setOpen(true)} onChange={e => { const next = e.target.value; setQ(next); setOpen(true); if (next.trim() !== query) { setItems([]); setSelected(-1); setBusy(!!next.trim()); } }} onKeyDown={e => {
      if (e.key === "Escape") { setOpen(false); setSelected(-1); }
      if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setSelected(i => items.length ? Math.min(i + 1, items.length - 1) : -1); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected(i => Math.max(-1, i - 1)); }
      if (e.key === "Enter" && visible && selected >= 0 && items[selected]) { e.preventDefault(); navigate(`/product/${items[selected].slug}`); }
    }} placeholder="Search for products..." className="field !pl-12 !pr-12" />
    {q && <button type="button" aria-label="Clear search" onClick={() => { setQ(""); setItems([]); setSelected(-1); }} className="absolute right-4 top-[18px] text-black/50"><X size={18} /></button>}
    {visible && <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[60vh] overflow-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10">
      <p role="status" className="px-3 py-2 text-xs text-black/50">{busy ? "Searching..." : error ? "Suggestions unavailable. Press Enter to search." : items.length ? `${total} matching product${total === 1 ? "" : "s"}` : "No matching products. Try another search."}</p>
      <ul id={`${id}-results`} role="listbox" aria-label="Suggested products">{items.map((p, i) => <li key={p.id} role="option" aria-selected={selected === i} id={`${id}-item-${i}`}><Link href={`/product/${p.slug}`} onClick={() => { setOpen(false); onNavigate?.(); }} className={`flex items-center gap-3 rounded-xl p-3 hover:bg-paper ${selected === i ? "bg-paper" : ""}`}>
        {p.image ? <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-paper object-cover" /> : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-paper text-xs uppercase">{p.category.slice(0, 2)}</span>}
        <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{p.name}</span><span className="mt-1 block text-xs capitalize text-black/50">{p.category}</span></span><span className="shrink-0 text-sm font-semibold">{money(p.price)}</span>
      </Link></li>)}</ul>
      {!busy && !error && total > 0 && <button type="submit" className="mt-1 w-full rounded-xl bg-paper px-4 py-3 text-left text-sm font-medium">View all results for “{query}” &rarr;</button>}
    </div>}
  </form>;
}
