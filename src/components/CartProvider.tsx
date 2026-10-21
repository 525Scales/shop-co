"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { productId: number; slug: string; name: string; price: number; oldPrice: number | null; color: string; size: string; qty: number; device: string; tint: string; image?: string };
type Ctx = { items: CartItem[]; count: number; ready: boolean; add: (i: CartItem) => void; setQty: (k: string, q: number) => void; remove: (k: string) => void; clear: () => void };
export const keyOf = (i: Pick<CartItem, "productId" | "color" | "size">) => `${i.productId}|${i.color}|${i.size}`;
const C = createContext<Ctx | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("shopco_cart") || "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem("shopco_cart", JSON.stringify(items)); } catch {} } }, [items, ready]);
  const add = useCallback((i: CartItem) => setItems((p) => {
    const k = keyOf(i); const f = p.find((x) => keyOf(x) === k);
    return f ? p.map((x) => (keyOf(x) === k ? { ...x, qty: Math.min(20, x.qty + i.qty) } : x)) : [...p, i];
  }), []);
  const setQty = useCallback((k: string, q: number) => setItems((p) => p.map((x) => (keyOf(x) === k ? { ...x, qty: Math.max(1, Math.min(20, q)) } : x))), []);
  const remove = useCallback((k: string) => setItems((p) => p.filter((x) => keyOf(x) !== k)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((s, i) => s + i.qty, 0), ready, add, setQty, remove, clear }), [items, ready, add, setQty, remove, clear]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useCart = () => { const c = useContext(C); if (!c) throw new Error("CartProvider missing"); return c; };
