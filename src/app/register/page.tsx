import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Device from "@/components/Device";

export default function Page() {
  return (
    <div className="container-x grid min-h-[70dvh] items-center gap-10 py-10 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-[32px] md:text-[40px]">Create your account</h1>
        <p className="mb-8 mt-3 text-black/60">Get 20% off your first order.</p>
        <Suspense><AuthForm mode="register" /></Suspense>
      </div>
      <div className="hidden h-full min-h-[460px] rounded-[28px] bg-paper p-10 lg:block"><Device type="laptop" tint="#1f2937" /></div>
    </div>
  );
}
