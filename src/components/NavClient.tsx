"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, MagnifyingGlass, ShoppingCart, UserCircle, X, CaretDown, SignOut, Gauge } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";
import Logo from "./Logo";
import { useUser } from "./UserProvider";
import ProductSearch from "./ProductSearch";

const LINKS = [["On Sale", "/shop?sale=1"], ["New Arrivals", "/shop?sort=new"], ["Brands", "/shop"]];

export default function NavClient() {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false), [menu, setMenu] = useState(false), [bar, setBar] = useState(true);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white">
      {bar && (
        <div className="relative bg-ink px-10 py-2.5 text-center text-xs text-white md:text-sm">
          Sign up and get 20% off to your first order. <Link href="/register" className="underline underline-offset-2">Sign Up Now</Link>
          <button aria-label="Close banner" onClick={() => setBar(false)} className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block"><X size={16} /></button>
        </div>
      )}
      <div className="container-x flex items-center gap-3 py-4 md:gap-10 md:py-5">
        <button aria-label="Open menu" className="md:hidden" onClick={() => setOpen(true)}><List size={24} /></button>
        <Logo />
        <nav className="hidden items-center gap-6 text-[15px] md:flex">
          <Link href="/shop" className="flex items-center gap-1 hover:opacity-60">Shop <CaretDown size={13} /></Link>
          {LINKS.map(([l, h]) => <Link key={l} href={h} className="hover:opacity-60">{l}</Link>)}
        </nav>
        <ProductSearch className="ml-auto hidden flex-1 md:block lg:max-w-xl" />
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <button type="button" onClick={() => setOpen(true)} aria-label="Search products" className="md:hidden"><MagnifyingGlass size={24} /></button>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingCart size={24} />
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <div className="relative">
            <button aria-label="Account" onClick={() => setMenu((v) => !v)}><UserCircle size={24} /></button>
            <AnimatePresence>
              {menu && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-9 w-56 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,.25)] ring-1 ring-black/5">
                  {user ? (<>
                    <div className="px-3 py-2 text-sm"><p className="font-bold">{user.name}</p><p className="truncate text-black/50">{user.email}</p></div>
                    {user.role === "admin" && <Link onClick={() => setMenu(false)} href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-paper"><Gauge size={18} />Admin panel</Link>}
                    <button onClick={() => { setMenu(false); logout(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-paper"><SignOut size={18} />Log out</button>
                  </>) : (<>
                    <Link onClick={() => setMenu(false)} href="/login" className="block rounded-xl px-3 py-2 text-sm hover:bg-paper">Log in</Link>
                    <Link onClick={() => setMenu(false)} href="/register" className="block rounded-xl px-3 py-2 text-sm hover:bg-paper">Create account</Link>
                  </>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (<>
          <motion.div className="fixed inset-0 bg-black/40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className="fixed inset-y-0 left-0 w-[82%] max-w-sm bg-white p-6 md:hidden">
            <div className="mb-8 flex items-center justify-between"><Logo className="text-2xl" /><button aria-label="Close menu" onClick={() => setOpen(false)}><X size={24} /></button></div>
            <ProductSearch className="mb-6" onNavigate={() => setOpen(false)} />
            <nav className="flex flex-col divide-y divide-black/10 text-lg">
              <Link onClick={() => setOpen(false)} href="/shop" className="py-4">Shop</Link>
              {LINKS.map(([l, h]) => <Link onClick={() => setOpen(false)} key={l} href={h} className="py-4">{l}</Link>)}
              {user?.role === "admin" && <Link onClick={() => setOpen(false)} href="/admin" className="py-4">Admin panel</Link>}
            </nav>
          </motion.aside>
        </>)}
      </AnimatePresence>
    </header>
  );
}
