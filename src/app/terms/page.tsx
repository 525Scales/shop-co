import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms & Conditions | SHOP.CO" };
const sections = [
  ["Shopping with SHOP.CO", "These terms apply when you use our store, create an account or place an order. Please read them before purchasing and keep a copy for your records. Your statutory consumer rights are unaffected."],
  ["Your account", "Provide accurate contact and delivery details and keep your password and verification codes private. Email verification is required for new accounts. You are responsible for activity on your account; contact the store if you suspect unauthorised use."],
  ["Products and prices", "Product descriptions, availability and prices are shown on the product page. Images are illustrative and colours may vary by screen. Review your selected options and the final total, including delivery and discounts, at checkout."],
  ["Orders and payment", "Submitting an order sends a purchase request to SHOP.CO. We may contact you if stock, pricing or delivery details need clarification. The current payment method is cash on delivery. An order confirmation records your request; keep the order number for enquiries."],
  ["Delivery", "Delivery depends on the destination and product availability. Check the delivery charge at checkout and provide an address and phone number where you can be reached. Contact the store with your order number for delivery questions or changes."],
  ["Returns, faults and warranty", "Contact the store with your order number and a description of the issue to request a return or report a fault. Applicable consumer law determines your cancellation, refund and repair rights. Any advertised product warranty applies in addition to those rights; consult the product information for its scope and conditions."],
  ["Email and newsletters", "We use your email to send requested verification codes and account communications. Newsletter subscription is optional. Subscribers receive a welcome email and may receive product news and offers. To unsubscribe, reply to a newsletter email with ‘Unsubscribe’."],
  ["Acceptable use", "Do not misuse the store, attempt unauthorised access, submit fraudulent orders or interfere with other customers. Store content may not be copied or redistributed without permission except as allowed by law."],
  ["Questions and changes", "For questions about these terms or an order, contact the store using the contact details supplied with your order. We may update these terms; the terms presented when you place an order apply to that order."],
];
export default function TermsPage() {
  return <article className="container-x max-w-4xl py-12 md:py-20">
    <Link href="/" className="text-sm text-black/50 hover:text-ink">Home / Terms & Conditions</Link>
    <h1 className="mt-6 font-display text-4xl md:text-6xl">Terms & Conditions</h1>
    <p className="mt-5 text-black/60">Please take a moment to read the terms for shopping with SHOP.CO.</p>
    <div className="mt-10 space-y-8">{sections.map(([title, text], i) => <section key={title} className="border-t border-black/10 pt-6"><h2 className="text-xl font-bold">{i + 1}. {title}</h2><p className="mt-3 leading-relaxed text-black/60">{text}</p></section>)}</div>
    <Link href="/shop" className="pill pill-dark mt-10 inline-flex">Continue shopping</Link>
  </article>;
}
