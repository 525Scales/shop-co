"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import ProductImage from "./ProductImage";
import { money } from "@/lib/utils";
import type { Product } from "@/lib/queries";

export default function AdminProductList({ items }: { items: Product[] }) {
  const router = useRouter();
  const del = async (p: Product) => { if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return; await fetch(`/api/products/${p.id}`, { method: "DELETE" }); router.refresh(); };
  if (!items.length) return <p className="rounded-[20px] bg-paper p-10 text-center text-black/60">No products yet. Add your first one.</p>;
  return (
    <ul className="divide-y divide-black/10 rounded-[20px] px-4 ring-1 ring-black/10 md:px-6">
      {items.map((p) => (
        <li key={p.id} className="flex items-center gap-4 py-4">
          <div className="w-16 shrink-0"><ProductImage p={p} className="!rounded-xl" /></div>
          <div className="min-w-0 flex-1"><p className="truncate font-bold">{p.name}</p>
            <p className="text-sm text-black/60 capitalize">{p.category} &middot; {p.style} &middot; stock {p.stock}{!p.active && " · hidden"}{p.isNew && " · new"}{p.isTop && " · top"}</p></div>
          <p className="hidden font-bold sm:block">{money(p.price)}</p>
          <Link aria-label={`Edit ${p.name}`} href={`/admin/products/${p.id}`} className="rounded-full p-2.5 transition hover:bg-paper"><PencilSimple size={20} /></Link>
          <button aria-label={`Delete ${p.name}`} onClick={() => del(p)} className="rounded-full p-2.5 text-sale transition hover:bg-sale/10"><Trash size={20} /></button>
        </li>))}
    </ul>
  );
}
