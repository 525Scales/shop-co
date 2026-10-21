import Link from "next/link";
import { stats, orders } from "../../lib/queries";
import { money } from "../../lib/utils";
export const dynamic = "force-dynamic";
export default function Admin() {
  const s = stats(), recent = orders().slice(0, 5);
  const K = [["Revenue", money(s.revenue)], ["Orders", s.orders], ["Products", s.products], ["Customers", s.customers]];
  return (
    <div>
      <h1 className="font-display text-[28px] md:text-[34px]">Overview</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{K.map(([l, v]) => <div key={l as string} className="rounded-[20px] bg-paper p-5"><dt className="text-sm text-black/60">{l}</dt><dd className="mt-1 text-3xl font-bold tabular-nums">{v}</dd></div>)}</dl>
      <div className="mt-8 flex items-center justify-between"><h2 className="text-xl font-bold">Recent orders</h2><Link href="/admin/orders" className="text-sm underline">View all</Link></div>
      {recent.length === 0 ? <p className="mt-4 rounded-[20px] bg-paper p-8 text-center text-black/60">No orders yet. They will appear here after the first checkout.</p> :
        <ul className="mt-4 divide-y divide-black/10 rounded-[20px] px-5 ring-1 ring-black/10">{recent.map((o) => <li key={o.id} className="flex justify-between py-4 text-sm"><span>#{o.id} &middot; {o.uname}</span><span className="font-bold">{money(o.total)} <span className="ml-2 rounded-full bg-paper px-2.5 py-1 text-xs font-medium capitalize">{o.status}</span></span></li>)}</ul>}
      <Link href="/admin/products/new" className="pill pill-dark mt-8">Add a product</Link>
    </div>
  );
}
