"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Stars from "./Stars";
import { useUser } from "./UserProvider";
import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Product, Review } from "@/lib/queries";

const FAQ = [["How long does delivery take?", "Delivery timing depends on your address and product availability. Contact the store to confirm the schedule for your order. Delivery is $9 below $150 and free for orders of $150 or more after product discounts."], ["What warranty do I get?", "Check the product information for applicable warranty coverage and conditions. Keep your order confirmation and contact the store with your order number if you need help with a fault."], ["Can I return a device?", "Contact the store with your order number, product name and the reason for your return. The team will explain the return conditions and next steps for your item."]];

export default function ProductTabs({ p, reviews }: { p: Product; reviews: Review[] }) {
  const loggedIn = !!useUser().user;
  const [tab, setTab] = useState<"d" | "r" | "f">("r"); const router = useRouter();
  const [rating, setRating] = useState(5), [body, setBody] = useState(""), [open, setOpen] = useState(false), [err, setErr] = useState(""), [faq, setFaq] = useState<number | null>(null);
  const post = async (e: React.FormEvent) => { e.preventDefault(); setErr("");
    const r = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: p.id, rating, body }) });
    if (r.ok) { setBody(""); setOpen(false); router.refresh(); } else setErr((await r.json()).error); };
  const T = ({ k, l }: { k: "d" | "r" | "f"; l: string }) => <button onClick={() => setTab(k)} className={cn("flex-1 border-b-2 pb-5 text-base md:text-xl", tab === k ? "border-ink font-medium" : "border-black/10 text-black/60")}>{l}</button>;
  return (
    <section className="mt-12 md:mt-16">
      <div className="flex"><T k="d" l="Product Details" /><T k="r" l="Rating & Reviews" /><T k="f" l="FAQs" /></div>
      {tab === "d" && <div className="max-w-3xl py-8 leading-relaxed text-black/70"><p>{p.description || "No description yet."}</p><p className="mt-4">Category: <span className="capitalize text-ink">{p.category}</span> &middot; Best for: <span className="capitalize text-ink">{p.style}</span></p></div>}
      {tab === "f" && <div className="divide-y divide-black/10 py-4">{FAQ.map(([q, a], i) => <div key={q}><button aria-expanded={faq === i} aria-controls={`product-faq-${i}`} onClick={() => setFaq(faq === i ? null : i)} className="flex w-full justify-between gap-4 py-5 text-left text-lg font-medium">{q}<span aria-hidden="true">{faq === i ? "-" : "+"}</span></button><p id={`product-faq-${i}`} hidden={faq !== i} className="pb-5 leading-relaxed text-black/60">{a}</p></div>)}<div className="pt-5"><Link href="/faq" className="text-sm font-medium underline underline-offset-4">View all frequently asked questions &rarr;</Link></div></div>}
      {tab === "r" && (
        <div className="py-6 md:py-8">
          <div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-bold md:text-2xl">All Reviews <span className="text-base font-normal text-black/50">({reviews.length})</span></h3>
            <button onClick={() => (loggedIn ? setOpen((v) => !v) : router.push(`/login?next=/product/${p.slug}`))} className="pill pill-dark !px-6 !py-3">Write a Review</button></div>
          {open && (<form onSubmit={post} className="mb-6 rounded-[20px] bg-paper p-5">
            <label className="label">Your rating</label><div className="mb-4 flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}><Stars value={n <= rating ? 1 : 0} size={28} /></button>)}</div>
            <label className="label" htmlFor="rb">Your review</label><textarea id="rb" rows={3} value={body} onChange={(e) => setBody(e.target.value)} className="field-sq bg-white" placeholder="What did you like about it?" />
            {err && <p className="err">{err}</p>}<button className="pill pill-dark mt-4 !py-3">Post review</button></form>)}
          {reviews.length === 0 ? <p className="rounded-[20px] bg-paper p-8 text-center text-black/60">No reviews yet. Be the first to write one.</p> : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">{reviews.map((r) => (
              <article key={r.id} className="rounded-[20px] p-6 ring-1 ring-black/10 md:p-8"><Stars value={r.rating} size={20} />
                <h4 className="mt-3 flex items-center gap-1.5 text-lg font-bold">{r.author}<CheckCircle size={20} weight="fill" className="text-emerald-600" /></h4>
                <p className="mt-2 text-[15px] leading-relaxed text-black/60">&ldquo;{r.body}&rdquo;</p>
                <p className="mt-5 text-sm font-medium text-black/60">Posted on {new Date(r.createdAt.replace(" ", "T") + "Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></article>))}</div>)}
        </div>)}
    </section>
  );
}
