import CheckoutForm from "@/components/CheckoutForm";
import { getUser } from "@/lib/auth";
export default async function Checkout() {
  const u = await getUser();
  return <div className="container-x py-8"><h1 className="mb-6 font-display text-[32px] md:text-[40px]">Checkout</h1><CheckoutForm name={u?.name || ""} /></div>;
}
