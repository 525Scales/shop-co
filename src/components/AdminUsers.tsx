"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type ManagedUser = { id: number; name: string; email: string; role: "admin" | "customer"; disabled: number; created_at: string; order_count: number };
export default function AdminUsers({ users, currentId }: { users: ManagedUser[]; currentId: number }) {
  const [q, setQ] = useState(""), [role, setRole] = useState("all");
  const shown = users.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase()) && (role === "all" || u.role === role));
  return <div className="mt-6"><div className="mb-5 flex flex-wrap gap-3"><input className="field min-w-0 flex-1" aria-label="Search users" placeholder="Search by name or email" value={q} onChange={e => setQ(e.target.value)} /><select className="field !w-auto" aria-label="Filter by role" value={role} onChange={e => setRole(e.target.value)}><option value="all">All roles</option><option value="customer">Customers</option><option value="admin">Admins</option></select></div><p className="mb-4 text-sm text-black/50">{shown.length} of {users.length} users</p><div className="space-y-4">{shown.map(u => <UserRow key={`${u.id}-${u.name}-${u.role}-${u.disabled}`} user={u} self={u.id === currentId} />)}{!shown.length && <p className="rounded-2xl bg-paper p-8 text-center">No users match your search.</p>}</div></div>;
}
function UserRow({ user: u, self }: { user: ManagedUser; self: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(u.name), [role, setRole] = useState(u.role), [disabled, setDisabled] = useState(!!u.disabled), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const changed = name !== u.name || role !== u.role || disabled !== !!u.disabled;
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const r = await fetch(`/api/admin/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, role, disabled }) });
      const j = await r.json();
      if (!r.ok) { setMessage(j.error || "Could not update user."); return; }
      setMessage("Changes saved."); router.refresh();
    } catch { setMessage("Unable to connect. Please try again."); } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="rounded-[20px] border border-black/10 p-5 md:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="break-all font-semibold">{u.email} {self && <span className="text-xs text-black/50">(you)</span>}</p><p className="mt-1 text-xs text-black/50">#{u.id} · Joined {u.created_at.slice(0, 10)} · {u.order_count} orders</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${u.disabled ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{u.disabled ? "Disabled" : "Active"}</span></div><div className="grid items-end gap-4 md:grid-cols-[1fr_150px_130px_auto]"><div><label className="label" htmlFor={`user-name-${u.id}`}>Name</label><input id={`user-name-${u.id}`} className="field" value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={100} required /></div><div><label className="label" htmlFor={`user-role-${u.id}`}>Role</label><select id={`user-role-${u.id}`} className="field" value={role} disabled={self || busy} onChange={e => setRole(e.target.value as typeof role)}><option value="customer">Customer</option><option value="admin">Admin</option></select></div><label className="flex items-center gap-2 py-3.5 text-sm"><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} disabled={self || busy} />Disabled</label><button className="pill pill-dark" disabled={busy || !changed}>{busy ? "Saving..." : "Save"}</button></div>{role === "admin" && <p className="mt-4 text-xs text-black/50">Admin sign-in requires a password and an emailed verification code.</p>}{message && <p role="status" className="mt-4 text-sm">{message}</p>}</form>;
}
