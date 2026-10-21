"use client";
import { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";

export default function Newsletter() {
  const [email, setEmail] = useState(""), [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null), [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
    const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json(); setBusy(false);
    setMsg(r.ok ? { ok: true, t: "You are on the list." } : { ok: false, t: j.error }); if (r.ok) setEmail("");
    } catch { setMsg({ ok: false, t: "Unable to connect. Please try again." }); } finally { setBusy(false); }
  };
  return (
    <div className="container-x relative z-10 -mb-[84px] md:-mb-[90px]">
      <div className="grid items-center gap-6 rounded-[20px] bg-ink px-6 py-8 text-white md:grid-cols-[1.2fr_1fr] md:gap-10 md:rounded-[28px] md:px-16 md:py-10">
        <h2 className="font-display text-[30px] leading-[1.05] md:text-[40px]">Stay upto date about our latest offers</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="relative"><EnvelopeSimple size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" aria-label="Email address" className="w-full rounded-full bg-white py-3.5 pl-12 pr-4 text-[15px] text-ink outline-none placeholder:text-black/40" /></div>
          <button disabled={busy} className="pill bg-white text-ink hover:bg-zinc-200">Subscribe to Newsletter</button>
          {msg && <p className={`text-sm ${msg.ok ? "text-emerald-300" : "text-red-300"}`} role="status">{msg.t}</p>}
        </form>
      </div>
    </div>
  );
}
