import OrderStatus from "../../../components/OrderStatus";
import { orders, orderItems } from "../../../lib/queries";
import { money } from "../../../lib/utils";
export const dynamic = "force-dynamic";
export default function Page() {
  const os = orders();
  return (
    <div><h1 className="mb-6 font-display text-[28px] md:text-[34px]">Orders</h1>
      {os.length === 0 ? <p className="rounded-[20px] bg-paper p-10 text-center text-black/60">No orders yet.</p> : (
        <ul className="space-y-4">{os.map((o) => (
          <li key={o.id} className="rounded-[20px] p-5 ring-1 ring-black/10">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold">#{o.id} &middot; {o.ship_name}</p><p className="text-sm text-black/60">{o.uemail} &middot; {o.ship_phone}</p><p className="text-sm text-black/60">{o.ship_address}, {o.ship_city}</p></div>
              <div className="flex items-center gap-3"><span className="text-xl font-bold">{money(o.total)}</span><OrderStatus id={o.id} status={o.status} /></div></div>
            <ul className="mt-3 border-t border-black/10 pt-3 text-sm text-black/70">{orderItems(o.id).map((i) => <li key={i.id}>{i.qty} x {i.name} <span className="text-black/40">{[i.size, i.color].filter(Boolean).join(", ")}</span></li>)}</ul>
          </li>))}</ul>)}
    </div>
  );
}
