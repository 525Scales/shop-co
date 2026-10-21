import Link from "next/link";
import AdminProductList from "@/components/AdminProductList";
import { allProducts } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default function Page() {
  return (<div><div className="mb-6 flex items-center justify-between"><h1 className="font-display text-[28px] md:text-[34px]">Products</h1><Link href="/admin/products/new" className="pill pill-dark !px-6 !py-3">Add product</Link></div><AdminProductList items={allProducts()} /></div>);
}
