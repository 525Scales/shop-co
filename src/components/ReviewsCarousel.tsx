"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Stars from "./Stars";
import type { Review } from "@/lib/queries";

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const r = useRef<HTMLDivElement>(null);
  const go = (d: number) => r.current?.scrollBy({ left: d * 420, behavior: "smooth" });
  return (
    <section className="container-x mt-20 md:mt-28">
      <div className="mb-8 flex items-end justify-between md:mb-10">
        <h2 className="font-display text-[32px] md:text-[48px]">Our happy customers</h2>
        <div className="flex gap-3"><button aria-label="Previous" onClick={() => go(-1)} className="rounded-full p-2 transition hover:bg-paper"><ArrowLeft size={24} /></button><button aria-label="Next" onClick={() => go(1)} className="rounded-full p-2 transition hover:bg-paper"><ArrowRight size={24} /></button></div>
      </div>
      {reviews.length === 0 ? <p className="rounded-[20px] bg-paper p-10 text-center text-black/60">No reviews yet.</p> : (
        <div ref={r} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:gap-5 md:px-0">
          {reviews.map((v) => (
            <figure key={v.id} className="w-[84%] shrink-0 snap-start rounded-[20px] p-6 ring-1 ring-black/10 md:w-[400px] md:p-8">
              <Stars value={v.rating} size={22} />
              <figcaption className="mt-4 flex items-center gap-1.5 text-lg font-bold md:text-xl">{v.author}<CheckCircle size={22} weight="fill" className="text-emerald-600" /></figcaption>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-black/60">&ldquo;{v.body}&rdquo;</blockquote>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
