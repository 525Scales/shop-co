import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsers, { type ManagedUser } from "@/components/AdminUsers";

export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin/users");
  const users = db().prepare(`SELECT u.id,u.name,u.email,u.role,u.disabled,u.created_at, (SELECT COUNT(*) FROM orders o WHERE o.user_id=u.id) AS order_count FROM users u ORDER BY u.id DESC`).all() as ManagedUser[];
  return <div><h1 className="font-display text-[28px] md:text-[34px]">User management</h1><p className="mt-3 text-black/60">Manage account access and roles. Disabling an account preserves its orders and reviews.</p><AdminUsers users={users} currentId={admin.id} /></div>;
}
