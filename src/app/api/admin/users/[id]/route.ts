import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = Number(params.id), b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim();
  if (!Number.isSafeInteger(id) || name.length < 2 || name.length > 100 || !["admin", "customer"].includes(b.role) || typeof b.disabled !== "boolean") return NextResponse.json({ error: "Enter a name (2–100 characters), valid role and account status." }, { status: 400 });
  const result = db().transaction(() => {
    const user = db().prepare("SELECT role,disabled FROM users WHERE id=?").get(id) as { role: string; disabled: number } | undefined;
    if (!user) return { error: "User not found.", status: 404 };
    if (id === admin.id && (b.disabled || b.role !== "admin")) return { error: "You cannot disable or demote your own account.", status: 400 };
    if (user.role === "admin" && !user.disabled && (b.disabled || b.role !== "admin")) {
      const count = db().prepare("SELECT COUNT(*) n FROM users WHERE role='admin' AND disabled=0").get() as { n: number };
      if (count.n <= 1) return { error: "Keep at least one active administrator.", status: 400 };
    }
    const revoke = user.role !== b.role || !!user.disabled !== b.disabled;
    db().prepare("UPDATE users SET name=?,role=?,disabled=?,session_version=session_version+? WHERE id=?").run(name, b.role, Number(b.disabled), Number(revoke), id);
    if (revoke) db().prepare("DELETE FROM admin_login_codes WHERE user_id=?").run(id);
    return null;
  })();
  if (result) return NextResponse.json({ error: result.error }, { status: result.status });
  revalidatePath("/admin/users");
  return NextResponse.json({ ok: true });
}
