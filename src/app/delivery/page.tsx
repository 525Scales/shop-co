import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import SupportContact from "@/components/SupportContact";

export const metadata: Metadata = { title: "Delivery Details | SHOP.CO" };
export default function DeliveryPage() {
  return <InfoPage title="From our store to your door." eyebrow="Delivery details" description="Everything to know about delivery charges, your address and receiving your order.">
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      <section className="rounded-[20px] bg-ink p-8 text-white"><p className="text-sm text-white/60">Orders of $150 or more</p><h2 className="mt-3 text-3xl font-bold">Free delivery</h2><p className="mt-4 leading-relaxed text-white/70">Calculated after product discounts. Your final charge appears at checkout.</p></section>
      <section className="rounded-[20px] border border-black/10 p-8"><p className="text-sm text-black/50">Orders below $150</p><h2 className="mt-3 text-3xl font-bold">$9 delivery</h2><p className="mt-4 leading-relaxed text-black/60">One delivery charge is added to your order total, shown before you place the order.</p></section>
    </div>
    <div className="mt-10 max-w-3xl space-y-8">
      {[
        ["Your delivery address", "At checkout, enter your full name, a reachable phone number, street address and city. Include an apartment number or other details needed to find you. Contact the store before ordering if you need to confirm service to your address."],
        ["Delivery timing", "Timing depends on your location and product availability. Checkout does not provide a guaranteed arrival date. Contact the store with your order number to confirm availability and the delivery schedule."],
        ["Receiving and paying for your order", "Payment is collected in cash on delivery. Keep your confirmation page handy so you can check the products and total. Contact the store before delivery if you need to confirm payment arrangements."],
        ["Changes or a missed delivery", "If your address or phone number changes, contact the store promptly and include your order number. Changes depend on dispatch status. If you miss a delivery, contact the store to discuss another arrangement."],
        ["Damaged or incorrect items", "Keep the packaging, note the issue and contact the store with your order number and photos. The team will explain the next steps for the affected item."],
      ].map(([title, text]) => <section key={title} className="border-b border-black/10 pb-8"><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 leading-relaxed text-black/60">{text}</p></section>)}
      <section><h2 className="mb-4 text-xl font-bold">Need help with a delivery?</h2><SupportContact /><Link href="/faq#deliveries" className="mt-5 inline-block font-medium underline underline-offset-4">Read delivery FAQs &rarr;</Link></section>
    </div>
  </InfoPage>;
}
