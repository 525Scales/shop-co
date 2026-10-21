import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Device from "@/components/Device";

export default function Page() {
  return (
    <div className="container-x grid min-h-[70dvh] items-center gap-10 py-10 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-[32px] md:text-[40px]">Welcome back</h1>
        <p className="mb-8 mt-3 text-black/60">Log in to check out faster and write reviews.</p>
        <Suspense><AuthForm mode="login" /></Suspense>
      </div>
      <div className="hidden h-full min-h-[460px] rounded-[28px] bg-paper p-10 lg:block"><Device type="phone" tint="#1f2937" /></div>
    </div>
  );
}
