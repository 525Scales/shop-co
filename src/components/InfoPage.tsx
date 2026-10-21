import Link from "next/link";

export default function InfoPage({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: React.ReactNode }) {
  return <article className="container-x py-10 md:py-16">
    <nav aria-label="Breadcrumb" className="mb-8 flex gap-2 text-sm text-black/50"><Link href="/" className="hover:text-ink">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{eyebrow}</span></nav>
    <header className="rounded-[24px] bg-paper px-6 py-10 md:px-10 md:py-14">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-black/50">SHOP.CO / {eyebrow}</p>
      <h1 className="font-display text-4xl md:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-black/60">{description}</p>
    </header>
    {children}
  </article>;
}
