import Link from "next/link";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { TwitterLogo, FacebookLogo, InstagramLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";

const COLS: [string, [string, string][]][] = [
  ["Help", [["Customer Support", "/faq#support"], ["Delivery Details", "/delivery"], ["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"]]],
  ["FAQ", [["Account", "/faq#account"], ["Manage Deliveries", "/faq#deliveries"], ["Orders", "/faq#orders"], ["Payments", "/faq#payments"]]],
];
export default function Footer() {
  return (
    <div className="mt-24 md:mt-32">
      <Newsletter />
      <footer className="bg-paper pt-[84px] md:pt-[90px]">
        <div className="container-x grid gap-10 pb-10 pt-12 lg:grid-cols-[1.4fr_2fr] lg:gap-24">
          <div className="max-w-[250px]">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-black/60">Phones, laptops, audio and wearables from brands we trust, backed by a 24-month warranty.</p>
            <div className="mt-6 flex gap-3">
              {[TwitterLogo, FacebookLogo, InstagramLogo, GithubLogo].map((I, i) => <span key={i} className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:bg-ink hover:text-white"><I size={16} weight="fill" /></span>)}
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8">
            {COLS.map(([h, ls]) => (
              <div key={h}><h4 className="mb-5 text-sm font-medium uppercase tracking-[0.16em]">{h === "FAQ" ? <Link href="/faq" className="hover:underline">{h}</Link> : h}</h4>
                <ul className="space-y-3.5 text-[15px] text-black/60">{ls.map(([l, href]) => <li key={l}><Link href={href} className="hover:text-ink">{l}</Link></li>)}</ul></div>
            ))}
          </nav>
        </div>
        <div className="container-x flex flex-col items-center justify-between gap-4 border-t border-black/10 py-6 text-sm text-black/60 md:flex-row">
          <p>Shop.co © 2000-{new Date().getFullYear()}, All Rights Reserved</p>
          <div className="flex gap-2">{["VISA", "MC", "PAY", "APAY", "GPAY"].map((c) => <span key={c} className="grid h-8 w-[46px] place-items-center rounded-md bg-white text-[10px] font-bold ring-1 ring-black/10">{c}</span>)}</div>
        </div>
      </footer>
    </div>
  );
}
