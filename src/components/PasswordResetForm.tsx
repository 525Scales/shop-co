"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export default function PasswordResetForm() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState(""), [code, setCode] = useState(""), [password, setPassword] = useState(""), [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState(""), [cooldown, setCooldown] = useState(0), [show, setShow] = useState(false);
  useEffect(() => { if (!cooldown) return; const timer = setTimeout(() => setCooldown(n => Math.max(0, n - 1)), 1000); return () => clearTimeout(timer); }, [cooldown]);
  async function sendCode() {
    setBusy(true); setError(""); setNotice("");
    try {
      const r = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Please try again."); return; }
      setNotice(j.message); setStep("reset"); setCooldown(60); setCode("");
    } catch { setError("Unable to connect. Please try again."); } finally { setBusy(false); }
  }
  async function reset(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, password }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Please try again."); return; }
      setPassword(""); setConfirm(""); setCode(""); setStep("done");
    } catch { setError("Unable to connect. Please try again."); } finally { setBusy(false); }
  }
  if (step === "done") return <div className="mt-6 space-y-6"><p role="status" className="leading-relaxed text-black/60">Your password has been updated. Previous sessions have been signed out. You can now log in with your new password.</p><Link href="/login" className="pill pill-dark w-full">Back to login</Link></div>;
  return <div className="mt-5"><p className="mb-6 leading-relaxed text-black/60">{step === "request" ? "Enter your account email and we’ll send you a code to choose a new password." : <>Enter the six-digit code sent to <strong>{email}</strong>. Use this browser to finish your reset. Codes expire in 10 minutes.</>}</p>
    <form onSubmit={step === "request" ? e => { e.preventDefault(); void sendCode(); } : reset} className="space-y-5">
      {step === "request" ? <div><label htmlFor="reset-email" className="label">Email address</label><input id="reset-email" className="field" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} required /></div> : <>
        {notice && <p role="status" className="rounded-xl bg-paper p-4 text-sm leading-relaxed text-black/60">{notice}</p>}
        <div><label htmlFor="reset-code" className="label">Verification code</label><input id="reset-code" className="field" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required maxLength={6} autoFocus /></div>
        <div><label htmlFor="reset-password" className="label">New password</label><div className="relative"><input id="reset-password" className="field !pr-12" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} maxLength={72} required /><button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50">{show ? <EyeSlash size={20} /> : <Eye size={20} />}</button></div><p className="mt-2 text-xs text-black/50">Use at least 8 characters.</p></div>
        <div><label htmlFor="confirm-password" className="label">Confirm new password</label><input id="confirm-password" className="field" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} minLength={8} maxLength={72} required /></div>
      </>}
      {error && <p role="alert" className="err">{error}</p>}
      <button disabled={busy} className="pill pill-dark w-full">{busy ? "Please wait..." : step === "request" ? "Send reset code" : "Reset password"}</button>
    </form>
    {step === "reset" && <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm"><button disabled={busy || cooldown > 0} type="button" onClick={() => void sendCode()} className="underline disabled:text-black/40">{cooldown ? `Resend code in ${cooldown}s` : "Resend code"}</button><button type="button" disabled={busy} onClick={() => { setStep("request"); setError(""); setNotice(""); setCode(""); setPassword(""); setConfirm(""); }} className="underline">Change email</button></div>}
    <p className="mt-6 text-center text-sm text-black/60"><Link href="/login" className="underline">Back to login</Link></p>
  </div>;
}
