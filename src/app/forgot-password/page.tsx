import type { Metadata } from "next";
import PasswordResetForm from "@/components/PasswordResetForm";

export const metadata: Metadata = { title: "Reset Password | SHOP.CO", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() {
  return <div className="container-x py-12 md:py-20"><div className="mx-auto max-w-lg rounded-[24px] border border-black/10 p-6 md:p-10"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Account recovery</p><h1 className="font-display text-3xl md:text-4xl">Reset your password</h1><PasswordResetForm /></div></div>;
}
