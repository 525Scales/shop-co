import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import SupportContact from "@/components/SupportContact";

export const metadata: Metadata = { title: "Privacy Policy | SHOP.CO" };
const sections = [
  ["Information you provide", "When you create an account, we store your name, email address and a hashed password. When you place an order, we store your order items, selected options, prices, delivery name, phone number, address and city. If you post a review, we store its rating, text and the name displayed with it. Newsletter signup stores your email address and subscription date."],
  ["How we use information", "We use account information to sign you in, verify your email and associate orders and reviews with your account. Delivery details support order fulfilment and enquiries. Newsletter email addresses are used for the newsletter you requested. Checkout currently uses cash on delivery and does not collect payment card details."],
  ["Cookies and browser storage", "A session cookie keeps you signed in for up to seven days, unless you log out sooner. Your browser’s local storage saves your cart so it can remain available between visits. You can remove these through your browser settings; doing so may sign you out or clear your cart."],
  ["Verification and email delivery", "New-account verification, admin sign-in and password recovery use temporary code records, including hashed codes, expiry times and attempt counts. Admin sign-in and password recovery also use temporary browser challenge cookies. Codes expire after 10 minutes and their records are removed after successful use. A successful password reset invalidates existing account sessions. SHOP.CO uses Gmail to send verification, password recovery and newsletter emails, so the recipient address and email content are processed through that service."],
  ["Public reviews and external services", "Reviews you submit may be displayed publicly with your account name and rating. Avoid including private information in a review. The site loads fonts from Google Fonts and Fontshare; your browser connects to those providers to retrieve them. Order delivery also requires the delivery details needed by the people fulfilling your order."],
  ["Storage and retention", "Account, order, review and subscription records are stored in the store’s database. Records may also be present in backups. There is currently no automatic account deletion or retention schedule in the app. Contact the store to ask about information held about you or request a correction or deletion; the store will explain what can be actioned, including any records that need to be retained."],
  ["Your choices", "Newsletter subscription is optional. Reply to a newsletter with ‘Unsubscribe’ to request removal from the mailing list. You can browse without creating an account, but checkout and review submission require login. For requests about your personal information, contact the store using the email associated with your account so the request can be verified."],
  ["Policy updates", "This page describes how the current SHOP.CO store handles information. We may update it when the store’s features or data practices change. Please check this page for the latest information."],
];
export default function PrivacyPage() {
  return <InfoPage title="Your privacy matters." eyebrow="Privacy policy" description="What information the store uses, why it is needed and how to ask us about it.">
    <div className="mt-10 max-w-3xl space-y-8">{sections.map(([title, text], i) => <section key={title} className="border-b border-black/10 pb-8"><h2 className="text-xl font-bold">{i + 1}. {title}</h2><p className="mt-3 leading-relaxed text-black/60">{text}</p></section>)}<section><h2 className="mb-4 text-xl font-bold">Privacy questions or requests</h2><SupportContact /></section></div>
  </InfoPage>;
}
