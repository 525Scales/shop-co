import Link from "next/link";

export default function NotFound() {
  return <section className="container-x py-20 text-center md:py-28">
    <p className="font-display text-[100px] leading-none text-black/10 md:text-[180px]">404</p>
    <h1 className="mt-4 font-display text-3xl md:text-5xl">This page is out of range.</h1>
    <p className="mx-auto mt-5 max-w-md text-black/60">The page may have moved, or the link may be incorrect. Let’s get you back to something you’ll love.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/shop" className="pill pill-dark">Explore the shop</Link><Link href="/" className="pill border border-black/20">Back to home</Link></div>
  </section>;
}
