const BRANDS = [
  ["LUMEN", "font-display text-[26px] tracking-tight"], ["aeris", "font-sans text-[30px] font-light tracking-[0.2em]"], ["VERTEX", "font-sans text-[26px] font-black tracking-[0.25em]"],
  ["Halo/Audio", "font-sans text-[26px] font-medium tracking-tight"], ["NOVA", "font-serif text-[28px] font-bold tracking-widest"],
];
export default function BrandStrip() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="overflow-hidden bg-ink py-9 text-white md:py-11" aria-label="Featured brands">
      <div className="flex w-max animate-marquee items-center gap-16 md:gap-24">
        {[...row, ...row].map(([n, c], i) => <span key={i} className={`${c} whitespace-nowrap`}>{n}</span>)}
      </div>
    </div>
  );
}
