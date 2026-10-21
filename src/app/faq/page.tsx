import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import SupportContact from "@/components/SupportContact";

export const metadata: Metadata = { title: "Frequently Asked Questions | SHOP.CO", description: "Help with your SHOP.CO account, deliveries, orders and payments." };
const topics = [
  { id: "account", title: "Account", questions: [
    ["How do I create an account?", "Choose Create account, enter your name, email and a password of at least eight characters. We email you a six-digit verification code. Enter it on the registration page to finish creating your account."],
    ["My verification code hasn’t arrived. What should I do?", "Check your spam folder and make sure the email address is correct. Codes expire after 10 minutes and allow five attempts. Use ‘Change email or request a new code’ on the verification screen to return to registration, then submit again. Wait at least one minute between requests."],
    ["Do I need an account to shop?", "You can browse products and add items to your cart without an account. You need to log in to place an order, view its confirmation or post a review."],
    ["How do I reset a forgotten password?", "Select ‘Forgot password?’ on the login page, enter your account email, then check your inbox and spam folder for a six-digit code. In the same browser, enter the code and your new password. Codes expire after 10 minutes and allow five attempts. You can request a new code after one minute. After resetting, sign in again; admin accounts still require their sign-in verification code."],
    ["Why does admin login ask for another code?", "Admin accounts require both a password and a six-digit code sent to the account’s email address. The code expires after 10 minutes and allows five attempts. Enter it in the same browser where you started signing in. If needed, return to login and request another code after one minute."],
    ["How do I unsubscribe from newsletters?", "Reply to a SHOP.CO newsletter with ‘Unsubscribe’. The store will remove you from the mailing list. Newsletter subscription is optional and separate from account registration."],
  ] },
  { id: "deliveries", title: "Manage deliveries", questions: [
    ["How much does delivery cost?", "Delivery costs $9 for orders below $150 after product discounts. Orders of $150 or more qualify for free delivery. Your delivery charge and final total are shown before you place your order."],
    ["When will my order arrive?", "Delivery timing depends on your address and product availability. A fixed arrival date is not provided at checkout. Contact the store with your order number to confirm the delivery schedule."],
    ["Can I change my delivery address?", "Contact the store as soon as possible with your order number and the corrected address or phone number. Delivery details cannot currently be edited online after checkout. Changes depend on whether the order has already been dispatched."],
    ["What if I miss a delivery or receive a damaged item?", "Contact the store with your order number to arrange the next step. For damage or a wrong item, keep the packaging and include photos and a description of the issue."],
  ] },
  { id: "orders", title: "Orders", questions: [
    ["How do I place an order?", "Choose your product options, add items to the cart and go to checkout. Log in, enter your full name, phone, street address and city, review the total, then select Place order. Keep the order number from the confirmation page."],
    ["Where can I check my order?", "After checkout, the confirmation page shows your order details and current status. Bookmark that page to return to it, and log in with the same account. For an update, contact the store with your order number."],
    ["Can I cancel or change an order?", "Contact the store promptly with your order number and requested change. There is no online cancellation or order-editing tool. The store will confirm what is possible based on the order’s current status."],
    ["How do I request a return or warranty help?", "Contact the store with your order number, product name and a description of the issue. Include photos where helpful and keep your order confirmation. The store will explain the next steps and the conditions that apply to your product."],
  ] },
  { id: "payments", title: "Payments", questions: [
    ["Which payment methods do you accept?", "The current checkout accepts cash on delivery. Payment is collected when your order is delivered; you do not enter card details online. Card and digital wallet payments are not currently available at checkout."],
    ["When do I pay, and how much?", "Pay the total shown on your order confirmation at delivery. The total includes the selected products, applicable product discounts and any delivery charge. Prices are displayed in US dollars ($). Contact the store before delivery if you need to confirm payment arrangements."],
    ["Are discounts included in my total?", "Product sale prices are applied automatically. The checkout summary shows the subtotal, discounts, delivery and final total. Review that total before placing your order."],
    ["How are refunds handled?", "Contact the store with your order number to discuss a refund request. Because checkout uses cash on delivery, there is no automatic online card refund. The store will confirm the outcome and payment arrangement with you."],
  ] },
];

export default function FAQPage() {
  return <InfoPage title="How can we help?" eyebrow="FAQ" description="Straightforward answers about your account, your next order and everything that happens after checkout.">
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[240px_1fr]">
      <nav aria-label="FAQ topics" className="flex flex-wrap gap-2 lg:sticky lg:top-40 lg:flex-col">{topics.map(t => <Link key={t.id} href={`#${t.id}`} className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium hover:bg-paper">{t.title}</Link>)}<Link href="#support" className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium hover:bg-paper">Contact support</Link></nav>
      <div className="min-w-0 space-y-12">{topics.map(t => <section key={t.id} id={t.id} aria-labelledby={`${t.id}-heading`} className="scroll-mt-40 rounded-[20px] border border-black/10 p-6 target:border-black/50 md:p-8">
        <h2 id={`${t.id}-heading`} className="mb-2 text-2xl font-bold md:text-3xl">{t.title}</h2>
        <div className="divide-y divide-black/10">{t.questions.map(([q, a]) => <div key={q} className="py-6 last:pb-0"><h3 className="text-lg font-semibold">{q}</h3><p className="mt-3 leading-relaxed text-black/60">{a}</p></div>)}</div>
        {t.id === "deliveries" && <Link href="/delivery" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">View delivery details &rarr;</Link>}
      </section>)}
      <section id="support" aria-labelledby="support-heading" className="scroll-mt-40 rounded-[20px] bg-paper p-6 md:p-8"><h2 id="support-heading" className="mb-4 text-2xl font-bold">Still need a hand?</h2><SupportContact /></section>
      </div>
    </div>
  </InfoPage>;
}
