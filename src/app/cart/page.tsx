import CartView from "@/components/CartView";
import Link from "next/link";
export default function Cart() {
  return <div className="container-x pb-4"><nav className="py-5 text-sm text-black/60"><Link href="/">Home</Link> &rsaquo; <span className="text-ink">Cart</span></nav>
    <h1 className="mb-6 font-display text-[32px] md:mb-8 md:text-[40px]">Your cart</h1><CartView /></div>;
}
