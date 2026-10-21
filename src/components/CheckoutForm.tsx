"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Summary } from "./CartView";

export default function CheckoutForm({ name }: { name: string }) {
  const { items, clear, ready } = useCart(); const router = useRouter();
  const [f, setF] = useState({ name, phone: "", address: "", city: "" }), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  if (ready && !items.length) return <div className="rounded-[20px] bg-paper px-6 py-16 text-center"><p className="text-xl font-bold">Nothing to check out</p><Link href="/shop" className="pill pill-dark mt-5">Browse products</Link></div>;
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, items: items.map((i) => ({ productId: i.productId, qty: i.qty, color: i.color, size: i.size })) }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error); clear(); router.push(`/order/${j.id}`); };
  const I = (k: keyof typeof f, l: string, ph: string) => <div><label className="label" htmlFor={k}>{l}</label><input id={k} required value={f[k]} placeholder={ph} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" /></div>;
  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      <div className="space-y-5 rounded-[20px] p-5 ring-1 ring-black/10 md:p-8"><h2 className="text-xl font-bold md:text-2xl">Delivery details</h2>
        <div className="grid gap-5 md:grid-cols-2">{I("name", "Full name", "Nino Kapanadze")}{I("phone", "Phone", "+995 555 12 47 83")}</div>{I("address", "Street address", "14 Rustaveli Ave, apt 9")}{I("city", "City", "Tbilisi")}
        <p className="text-sm text-black/50">Payment is collected on delivery.</p>{err && <p className="err" role="alert">{err}</p>}</div>
      <Summary cta={<button disabled={busy} className="pill pill-dark mt-6 w-full">{busy ? "Placing order..." : "Place order"}</button>} />
    </form>
  );
}
