"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Funnel, X, Check, CaretRight } from "@phosphor-icons/react";
import { CATEGORIES, COLORS, STORAGE, USES, cn } from "@/lib/utils";


function Panel({ onDone }: { onDone?: () => void }) {
  const sp = useSearchParams(); const router = useRouter(); const path = usePathname();
  const [max, setMax] = useState(Number(sp.get("max") || 2500));
  const set = (k: string, v?: string) => { const n = new URLSearchParams(sp.toString()); if (!v || n.get(k) === v) n.delete(k); else n.set(k, v); n.delete("page"); router.push(`${path}?${n}`); };
  const apply = () => { const n = new URLSearchParams(sp.toString()); n.set("max", String(max)); n.delete("page"); router.push(`${path}?${n}`); onDone?.(); };
  const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => <div className="border-t border-black/10 py-5"><h4 className="mb-4 text-xl font-bold">{t}</h4>{children}</div>;
  return (
    <div>
      <ul className="pb-5 text-black/60">{CATEGORIES.map(([k, l]) => (
        <li key={k}><button onClick={() => set("category", k)} className={cn("flex w-full items-center justify-between py-2.5 text-left hover:text-ink", sp.get("category") === k && "font-bold text-ink")}>{l}<CaretRight size={14} /></button></li>
      ))}</ul>
      <Sec t="Price"><input type="range" min={20} max={2500} step={10} value={max} onChange={(e) => setMax(Number(e.target.value))} className="rng" aria-label="Maximum price" />
        <div className="mt-3 flex justify-between text-sm font-medium"><span>$20</span><span>${max.toLocaleString("en-US")}</span></div></Sec>
      <Sec t="Colors"><div className="flex flex-wrap gap-3">{Object.entries(COLORS).map(([k, hex]) => (
        <button key={k} aria-label={k} onClick={() => set("color", k)} style={{ background: hex }} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-black/20 transition active:scale-90">
          {sp.get("color") === k && <Check size={16} weight="bold" className={k === "white" || k === "yellow" || k === "sand" ? "text-ink" : "text-white"} />}</button>))}</div></Sec>
      <Sec t="Storage"><div className="flex flex-wrap gap-2">{STORAGE.map((s) => (
        <button key={s} onClick={() => set("size", s)} className={cn("rounded-full px-4 py-2 text-sm transition", sp.get("size") === s ? "bg-ink text-white" : "bg-paper text-black/60 hover:bg-zinc-200")}>{s}</button>))}</div></Sec>
      <Sec t="Best for"><ul className="text-black/60">{USES.map((s) => (
        <li key={s}><button onClick={() => set("style", s)} className={cn("flex w-full items-center justify-between py-2.5 capitalize hover:text-ink", sp.get("style") === s && "font-bold text-ink")}>{s}<CaretRight size={14} /></button></li>))}</ul></Sec>
      <button onClick={apply} className="pill pill-dark w-full">Apply Filter</button>
      <button onClick={() => { router.push(path); onDone?.(); }} className="mt-3 w-full text-center text-sm text-black/50 underline">Clear all</button>
    </div>
  );
}

export default function ShopFilters() {
  const [open, setOpen] = useState(false);
  return (<>
    <aside className="sticky top-28 hidden h-fit w-[295px] shrink-0 rounded-[20px] p-6 ring-1 ring-black/10 lg:block"><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-bold">Filters</h3><Funnel size={20} /></div><Panel /></aside>
    <button onClick={() => setOpen(true)} aria-label="Open filters" className="grid h-10 w-10 place-items-center rounded-full bg-paper lg:hidden"><Funnel size={20} /></button>
    <AnimatePresence>{open && (<>
      <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
      <motion.div className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[28px] bg-white p-6" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
        <div className="mb-3 flex items-center justify-between"><h3 className="text-xl font-bold">Filters</h3><button aria-label="Close" onClick={() => setOpen(false)}><X size={22} /></button></div>
        <Panel onDone={() => setOpen(false)} />
      </motion.div></>)}</AnimatePresence>
  </>);
}
