"use client";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Device from "./Device";

function Count({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0); const txt = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US") + suffix);
  useEffect(() => { if (inView) { const c = animate(mv, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] }); return () => c.stop(); } }, [inView, mv, to]);
  return <motion.span ref={ref}>{txt}</motion.span>;
}
const Sparkle = ({ className }: { className: string }) => (
  <motion.svg viewBox="0 0 100 100" className={className} animate={{ rotate: [0, 90, 0], scale: [1, 1.12, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
    <path d="M50 0 C52 30 70 48 100 50 C70 52 52 70 50 100 C48 70 30 52 0 50 C30 48 48 30 50 0Z" fill="currentColor" />
  </motion.svg>
);
const up = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } } };

export default function Hero({ hasPhoto }: { hasPhoto: boolean }) {
  return (
    <section className="bg-paper">
      <div className="container-x grid items-stretch gap-0 lg:grid-cols-[1.08fr_1fr]">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }} className="flex flex-col justify-center py-10 md:py-16 lg:py-24 lg:pr-8">
          <motion.h1 variants={up} className="font-display text-[38px] leading-[1.02] md:text-[56px] lg:text-[64px]">Find tech that fits the way you live</motion.h1>
          <motion.p variants={up} className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-black/60 md:mt-8 md:text-base">
            Browse phones, laptops, audio and wearables chosen for build quality and honest specs, with a 24-month warranty on every device.
          </motion.p>
          <motion.div variants={up} className="mt-6 md:mt-9"><Link href="/shop" className="pill pill-dark w-full md:w-auto md:px-14">Shop Now</Link></motion.div>
          <motion.dl variants={up} className="mt-8 grid grid-cols-2 gap-y-4 md:mt-12 md:grid-cols-3 md:divide-x md:divide-black/10">
            {[[120, "Trusted Brands"], [2000, "Products In Stock"], [30000, "Happy Customers"]].map(([n, l], i) => (
              <div key={l as string} className={`${i === 2 ? "col-span-2 text-center md:col-span-1 md:text-left" : ""} ${i === 0 ? "md:pr-8" : i === 1 ? "md:px-8" : "md:pl-8"} ${i === 0 ? "border-r border-black/10 md:border-r-0" : ""}`}>
                <dt className="text-[26px] font-bold md:text-[38px]"><Count to={n as number} /></dt>
                <dd className="text-xs text-black/60 md:text-base">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }} className="relative min-h-[380px] md:min-h-[520px] lg:min-h-[640px]">
          <Sparkle className="absolute right-2 top-10 h-14 w-14 text-ink md:right-6 md:h-[104px] md:w-[104px]" />
          <Sparkle className="absolute left-0 top-[46%] h-8 w-8 text-ink md:h-[56px] md:w-[56px]" />
          {hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/hero.jpg" alt="Devices on a desk" className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center">
              <div className="relative h-[92%] w-[92%]">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[2%] left-[0%] h-[66%] w-[74%]"><Device type="laptop" tint="#9aa3ad" /></motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[4%] top-[2%] h-[62%] w-[44%]"><Device type="phone" tint="#1f2937" /></motion.div>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-0 right-[2%] h-[40%] w-[40%]"><Device type="headphones" tint="#2b2b2b" /></motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
