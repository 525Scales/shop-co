import { notFound } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";
import { getProductById } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === "new"; const p = isNew ? undefined : getProductById(Number(params.id));
  if (!isNew && !p) notFound();
  return (<div><h1 className="mb-6 font-display text-[28px] md:text-[34px]">{isNew ? "New product" : "Edit product"}</h1><AdminProductForm product={p ?? undefined} /></div>);
}
