import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { orderItems } from "@/lib/queries";
import { money } from "@/lib/utils";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const u = await getUser();
  const o = db().prepare("SELECT * FROM orders WHERE id=?").get(Number(params.id)) as any;
  if (!o || !u || (o.user_id !== u.id && u.role !== "admin")) notFound();
  return (
    <div className="container-x max-w-2xl py-12 text-center">
      <CheckCircle size={64} weight="fill" className="mx-auto text-emerald-600" />
      <h1 className="mt-5 font-display text-[32px] md:text-[40px]">Order #{o.id} placed</h1>
      <p className="mt-3 text-black/60">We will call {o.ship_phone} to confirm delivery to {o.ship_address}, {o.ship_city}.</p>
      <ul className="mt-8 divide-y divide-black/10 rounded-[20px] px-6 text-left ring-1 ring-black/10">
        {orderItems(o.id).map((i) => <li key={i.id} className="flex justify-between py-4"><span>{i.name} <span className="text-black/50">x{i.qty} {i.size || ""}</span></span><span className="font-bold">{money(i.price * i.qty)}</span></li>)}
        <li className="flex justify-between py-4 text-lg font-bold"><span>Total</span><span>{money(o.total)}</span></li>
      </ul>
      <Link href="/shop" className="pill pill-dark mt-8">Continue shopping</Link>
    </div>
  );
}
