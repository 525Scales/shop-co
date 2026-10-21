"use client";
import { useRouter } from "next/navigation";
export default function OrderStatus({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  return (
    <select aria-label={`Status of order ${id}`} defaultValue={status} onChange={async (e) => { await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) }); router.refresh(); }} className="rounded-full bg-paper px-4 py-2 text-sm capitalize outline-none">
      {["pending", "paid", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
    </select>
  );
}
