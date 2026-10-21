"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { SessionUser } from "@/lib/auth";

const C = createContext<{ user: SessionUser | null; loaded: boolean; logout: () => Promise<void> }>({ user: null, loaded: false, logout: async () => {} });

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null), [loaded, setLoaded] = useState(false);
  useEffect(() => { fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()).then((j) => setUser(j.user)).catch(() => {}).finally(() => setLoaded(true)); }, []);
  const logout = async () => {
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/"); // full reload clears every cached page that knew the user
  };
  return <C.Provider value={{ user, loaded, logout }}>{children}</C.Provider>;
}
export const useUser = () => useContext(C);
