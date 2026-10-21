"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const sp = useSearchParams(); const reg = mode === "register";
  const [verifying, setVerifying] = useState(false), [code, setCode] = useState("");
  const [adminVerification, setAdminVerification] = useState(false);
  const [v, setV] = useState({ name: "", email: "", password: "" }), [errs, setErrs] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false), [show, setShow] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setErrs({}); setBusy(true);
    try {
    const r = await fetch(`/api/auth/${verifying ? adminVerification ? "admin-verify" : "verify" : mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(verifying ? { email: v.email, code } : v) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErrs(j.errors || { form: j.error });
    if (j.requiresVerification) { setAdminVerification(j.verificationType === "admin"); setVerifying(true); return; }
    const next = sp.get("next"); window.location.assign(next && next.startsWith("/") && !next.startsWith("//") ? next : j.role === "admin" ? "/admin" : "/");
    } catch { setErrs({ form: "Unable to connect. Please try again." }); } finally { setBusy(false); } };
  if (verifying) return <form onSubmit={submit} className="space-y-5">
    {adminVerification && <h2 className="text-xl font-bold">Verify your admin sign-in</h2>}
    <p className="text-black/60">We sent a six-digit code to <strong>{v.email}</strong>. It expires in 10 minutes.</p>
    <div><label className="label" htmlFor="code">Verification code</label><input id="code" className="field" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus /></div>
    {errs.form && <p className="err" role="alert">{errs.form}</p>}
    <button disabled={busy} className="pill pill-dark w-full">{busy ? "Verifying..." : adminVerification ? "Verify & sign in" : "Verify email & create account"}</button>
    <button type="button" className="text-sm underline" onClick={() => { setVerifying(false); setCode(""); setErrs({}); }}>Change email or request a new code</button>
  </form>;
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {reg && <div><label className="label" htmlFor="name">Full name</label><input id="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className="field" autoComplete="name" />{errs.name && <p className="err">{errs.name}</p>}</div>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} className="field" autoComplete="email" />{errs.email && <p className="err">{errs.email}</p>}</div>
      <div><label className="label" htmlFor="password">Password</label>
        <div className="relative"><input id="password" type={show ? "text" : "password"} value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} className="field pr-12" autoComplete={reg ? "new-password" : "current-password"} />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50">{show ? <EyeSlash size={20} /> : <Eye size={20} />}</button></div>
        {reg && !errs.password && <p className="mt-1.5 text-sm text-black/50">At least 8 characters.</p>}{errs.password && <p className="err">{errs.password}</p>}</div>
      {errs.form && <p className="err" role="alert">{errs.form}</p>}
      {!reg && <div className="text-right"><Link href="/forgot-password" className="text-sm text-black/60 underline underline-offset-4 hover:text-ink">Forgot password?</Link></div>}
      {reg && <p className="text-sm text-black/60">By creating an account, you agree to our <Link href="/terms" className="underline">Terms & Conditions</Link>.</p>}
      <button disabled={busy} className="pill pill-dark w-full">{busy ? "Please wait..." : reg ? "Create account" : "Log in"}</button>
      <p className="text-center text-sm text-black/60">{reg ? "Already have an account?" : "New here?"} <Link href={reg ? "/login" : "/register"} className="font-medium text-ink underline">{reg ? "Log in" : "Create an account"}</Link></p>
    </form>
  );
}
