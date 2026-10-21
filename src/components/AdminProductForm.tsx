"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, UploadSimple } from "@phosphor-icons/react";
import Device from "./Device";
import { CATEGORIES, COLORS, DEVICES, STORAGE, USES, cn } from "@/lib/utils";
import type { Product } from "@/lib/queries";

const blank = { name: "", description: "", price: "", oldPrice: "", category: "phones", style: "everyday", device: "phone", tint: "#1f2937", colors: [] as string[], sizes: [] as string[], images: [] as string[], stock: "50", isNew: false, isTop: false, active: true };

export default function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [f, setF] = useState(product ? { ...blank, ...product, price: String(product.price), oldPrice: product.oldPrice ? String(product.oldPrice) : "", stock: String(product.stock) } : blank);
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false), [up, setUp] = useState(false);
  const toggle = (k: "colors" | "sizes", v: string) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });
  const upload = async (files: FileList | null) => { if (!files?.length) return; setUp(true); setErr(""); const urls: string[] = [];
    for (const file of Array.from(files)) { const fd = new FormData(); fd.append("file", file); const r = await fetch("/api/upload", { method: "POST", body: fd }); const j = await r.json(); if (r.ok) urls.push(j.url); else setErr(j.error); }
    setF((s) => ({ ...s, images: [...s.images, ...urls] })); setUp(false); };
  const save = async (e: React.FormEvent) => { e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch(product ? `/api/products/${product.id}` : "/api/products", { method: product ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setBusy(false); if (!r.ok) return setErr(j.error); router.push("/admin/products"); router.refresh(); };
  const Chk = ({ k, l }: { k: "isNew" | "isTop" | "active"; l: string }) => <label className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="checkbox" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} className="h-5 w-5 accent-[#0d0d0d]" />{l}</label>;
  return (
    <form onSubmit={save} className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <div><label className="label" htmlFor="n">Name</label><input id="n" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="field" /></div>
        <div><label className="label" htmlFor="d">Description</label><textarea id="d" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="field-sq" /></div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div><label className="label" htmlFor="p">Price ($)</label><input id="p" type="number" min="1" step="1" required value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className="field" /></div>
          <div><label className="label" htmlFor="o">Old price (optional)</label><input id="o" type="number" min="1" step="1" value={f.oldPrice} onChange={(e) => setF({ ...f, oldPrice: e.target.value })} className="field" /></div>
          <div><label className="label" htmlFor="s">Stock</label><input id="s" type="number" min="0" value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} className="field" /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="c">Category</label><select id="c" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="field">{CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
          <div><label className="label" htmlFor="st">Best for</label><select id="st" value={f.style} onChange={(e) => setF({ ...f, style: e.target.value })} className="field capitalize">{USES.map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div><span className="label">Colors / finishes</span><div className="flex flex-wrap gap-3">{Object.entries(COLORS).map(([k, hex]) => <button type="button" key={k} onClick={() => toggle("colors", k)} aria-label={k} aria-pressed={f.colors.includes(k)} style={{ background: hex }} className={cn("h-9 w-9 rounded-full ring-1 ring-black/20 transition", f.colors.includes(k) && "ring-2 ring-ink ring-offset-2")} />)}</div></div>
        <div><span className="label">Storage options (leave empty if none)</span><div className="flex flex-wrap gap-2">{STORAGE.map((s) => <button type="button" key={s} onClick={() => toggle("sizes", s)} className={cn("rounded-full px-4 py-2 text-sm", f.sizes.includes(s) ? "bg-ink text-white" : "bg-paper text-black/60")}>{s}</button>)}</div></div>
        <div className="flex flex-wrap gap-6"><Chk k="isNew" l="Show in New Arrivals" /><Chk k="isTop" l="Show in Top Selling" /><Chk k="active" l="Visible in store" /></div>
      </div>
      <div className="space-y-5">
        <div><span className="label">Photos</span>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[20px] border-2 border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60 transition hover:bg-paper"><UploadSimple size={26} />{up ? "Uploading..." : "Upload JPG, PNG or WebP (max 5 MB)"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => { const el = e.target; upload(el.files).finally(() => { el.value = ""; }); }} /></label>
          {f.images.length > 0 && <ul className="mt-3 grid grid-cols-3 gap-3">{f.images.map((u, i) => (<li key={u} className="relative aspect-square overflow-hidden rounded-xl bg-paper">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={u} alt="" className="h-full w-full object-cover" />
            <button type="button" aria-label="Remove photo" onClick={() => setF({ ...f, images: f.images.filter((_, j) => j !== i) })} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow"><X size={12} /></button></li>))}</ul>}
        </div>
        <div><span className="label">Illustration (used when there is no photo)</span>
          <div className="aspect-square rounded-[20px] bg-paper p-8"><Device type={f.device} tint={f.tint} /></div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3"><select aria-label="Device type" value={f.device} onChange={(e) => setF({ ...f, device: e.target.value })} className="field capitalize">{DEVICES.map((g) => <option key={g}>{g}</option>)}</select>
            <input aria-label="Tint" type="color" value={f.tint} onChange={(e) => setF({ ...f, tint: e.target.value })} className="h-[50px] w-14 cursor-pointer rounded-full bg-paper p-1.5" /></div></div>
        {err && <p className="err" role="alert">{err}</p>}
        <button disabled={busy} className="pill pill-dark w-full">{busy ? "Saving..." : product ? "Save changes" : "Create product"}</button>
      </div>
    </form>
  );
}
