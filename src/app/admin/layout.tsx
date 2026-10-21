import Link from "next/link";
import { Gauge, DeviceMobile, Receipt, Users } from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
const L = [["/admin", "Overview", Gauge], ["/admin/products", "Products", DeviceMobile], ["/admin/orders", "Orders", Receipt], ["/admin/users", "Users", Users]] as const;
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAdmin())) redirect("/login?next=/admin");
  return (
    <div className="container-x grid gap-6 py-6 md:py-10 lg:grid-cols-[220px_1fr]">
      <nav className="flex flex-wrap gap-2 lg:flex-col" aria-label="Admin">
        {L.map(([h, l, I]) => <Link key={h} href={h} className="flex items-center gap-2.5 rounded-full bg-paper px-5 py-3 text-sm font-medium transition hover:bg-ink hover:text-white lg:rounded-2xl"><I size={18} />{l}</Link>)}
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
