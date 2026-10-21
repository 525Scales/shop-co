import clsx, { type ClassValue } from "clsx";
export const cn = (...a: ClassValue[]) => clsx(a);
export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const discountPct = (price: number, old?: number | null) =>
  old && old > price ? Math.round(((old - price) / old) * 100) : 0;
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const COLORS: Record<string, string> = {
  black: "#171717", white: "#f4f4f5", silver: "#c4c9cf", graphite: "#4b5563", midnight: "#1f2a44", gold: "#d8b878",
  blue: "#2f6fdb", green: "#2f9e6f", red: "#e5484d", orange: "#f08a24", pink: "#f2a7c3", purple: "#7c6ad6", sand: "#d9c9a8",
};
export const STORAGE = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
export const CATEGORIES: [string, string][] = [["phones", "Phones"], ["laptops", "Laptops"], ["tablets", "Tablets"], ["audio", "Audio"], ["wearables", "Wearables"], ["gaming", "Gaming"], ["cameras", "Cameras"]];
export const USES = ["everyday", "work", "gaming", "creative"] as const;
export const DEVICES = ["phone", "tablet", "laptop", "headphones", "earbuds", "speaker", "watch", "camera", "controller"] as const;
export const SHIPPING = { freeOver: 150, fee: 9 };
