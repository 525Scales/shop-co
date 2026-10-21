import Link from "next/link";
import Device from "./Device";
import Reveal from "./Reveal";

const T = [
  { k: "phones", l: "Phones", span: "md:col-span-2", g: "phone", c: "#1f2937" }, { k: "laptops", l: "Laptops", span: "md:col-span-3", g: "laptop", c: "#9aa3ad" },
  { k: "audio", l: "Audio", span: "md:col-span-3", g: "headphones", c: "#2b2b2b" }, { k: "gaming", l: "Gaming", span: "md:col-span-2", g: "controller", c: "#1e3a8a" },
];
export default function CategoryTiles() {
  return (
    <section className="container-x mt-20 md:mt-28">
      <div className="rounded-[28px] bg-paper px-5 py-10 md:rounded-[40px] md:px-16 md:py-[72px]">
        <h2 className="text-center font-display text-[32px] md:text-[48px]">Browse by category</h2>
        <div className="mt-8 grid gap-4 md:mt-16 md:grid-cols-5 md:gap-5">
          {T.map((t, i) => (
            <Reveal key={t.k} delay={i * 0.06} className={t.span}>
              <Link href={`/shop?category=${t.k}`} className="group relative block h-[190px] overflow-hidden rounded-[20px] bg-white md:h-[289px]">
                <span className="absolute left-6 top-5 z-10 text-2xl font-bold md:left-9 md:top-8 md:text-4xl">{t.l}</span>
                <div className="absolute -bottom-4 right-2 h-[84%] w-[52%] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 md:-right-1 md:h-[100%] md:w-[46%]"><Device type={t.g} tint={t.c} /></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
