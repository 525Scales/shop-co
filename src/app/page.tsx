import fs from "node:fs";
import path from "node:path";
import Hero from "@/components/Hero";
import BrandStrip from "@/components/BrandStrip";
import ProductRow from "@/components/ProductRow";
import CategoryTiles from "@/components/CategoryTiles";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { listFlag, featuredReviews } from "@/lib/queries";

export const revalidate = 60;

export default function Home() {
  const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", "hero.jpg"));
  return (
    <>
      <Hero hasPhoto={hasPhoto} />
      <BrandStrip />
      <ProductRow title="New Arrivals" items={listFlag("is_new")} href="/shop?sort=new" first />
      <div className="container-x mt-14 border-t border-black/10 md:mt-16" />
      <ProductRow title="Top Selling" items={listFlag("is_top")} href="/shop?sort=rating" />
      <CategoryTiles />
      <ReviewsCarousel reviews={featuredReviews()} />
    </>
  );
}
