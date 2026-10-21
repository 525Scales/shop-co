import { db } from "./db";

export type Product = {
  id: number; slug: string; name: string; description: string; price: number; oldPrice: number | null;
  category: string; style: string; device: string; tint: string; colors: string[]; sizes: string[]; images: string[];
  stock: number; isNew: boolean; isTop: boolean; active: boolean; rating: number; reviewCount: number;
};
type Row = Record<string, any>;
const BASE = `SELECT p.*, COALESCE((SELECT ROUND(AVG(rating),1) FROM reviews r WHERE r.product_id=p.id),0) AS rating,
  (SELECT COUNT(*) FROM reviews r WHERE r.product_id=p.id) AS review_count FROM products p`;
const map = (r: Row): Product => ({
  id: r.id, slug: r.slug, name: r.name, description: r.description, price: r.price, oldPrice: r.old_price,
  category: r.category, style: r.style, device: r.device, tint: r.tint, colors: JSON.parse(r.colors), sizes: JSON.parse(r.sizes),
  images: JSON.parse(r.images), stock: r.stock, isNew: !!r.is_new, isTop: !!r.is_top, active: !!r.active, rating: r.rating, reviewCount: r.review_count,
});

export const listFlag = (flag: "is_new" | "is_top", n = 4) =>
  (db().prepare(`${BASE} WHERE p.active=1 AND p.${flag}=1 ORDER BY p.created_at DESC, p.id DESC LIMIT ?`).all(n) as Row[]).map(map);
export const getProduct = (slug: string) => { const r = db().prepare(`${BASE} WHERE p.slug=?`).get(slug) as Row | undefined; return r ? map(r) : null; };
export const getProductById = (id: number) => { const r = db().prepare(`${BASE} WHERE p.id=?`).get(id) as Row | undefined; return r ? map(r) : null; };
export const related = (id: number, n = 4) =>
  (db().prepare(`${BASE} WHERE p.active=1 AND p.id<>? ORDER BY RANDOM() LIMIT ?`).all(id, n) as Row[]).map(map);
export const allProducts = () => (db().prepare(`${BASE} ORDER BY p.id DESC`).all() as Row[]).map(map);

export type Filters = { style?: string; category?: string; min?: number; max?: number; color?: string; size?: string; sale?: boolean; sort?: string; page?: number; q?: string };
export function search(f: Filters, per = 9) {
  const w: string[] = ["p.active=1"]; const a: any[] = [];
  if (f.style) { w.push("p.style=?"); a.push(f.style); }
  if (f.category) { w.push("p.category=?"); a.push(f.category); }
  if (f.min != null) { w.push("p.price>=?"); a.push(f.min); }
  if (f.max != null) { w.push("p.price<=?"); a.push(f.max); }
  if (f.color) { w.push("p.colors LIKE ?"); a.push(`%"${f.color}"%`); }
  if (f.size) { w.push("p.sizes LIKE ?"); a.push(`%"${f.size}"%`); }
  if (f.sale) w.push("p.old_price IS NOT NULL");
  const terms = (f.q || "").trim().slice(0, 120).split(/\s+/).filter(Boolean).slice(0, 8);
  for (const term of terms) {
    const pattern = `%${term.replace(/[\\%_]/g, "\\$&")}%`;
    w.push("(p.name LIKE ? ESCAPE '\\' OR p.description LIKE ? ESCAPE '\\' OR p.category LIKE ? ESCAPE '\\')");
    a.push(pattern, pattern, pattern);
  }
  const order = f.sort === "price-asc" ? "p.price ASC" : f.sort === "price-desc" ? "p.price DESC" : f.sort === "rating" ? "rating DESC" : "p.created_at DESC, p.id DESC";
  const where = w.join(" AND ");
  const total = (db().prepare(`SELECT COUNT(*) c FROM products p WHERE ${where}`).get(...a) as { c: number }).c;
  const page = Math.max(1, f.page || 1);
  const rows = db().prepare(`${BASE} WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...a, per, (page - 1) * per) as Row[];
  return { items: rows.map(map), total, pages: Math.max(1, Math.ceil(total / per)), page };
}

export type Review = { id: number; author: string; rating: number; body: string; createdAt: string };
export const reviewsFor = (pid: number) =>
  (db().prepare("SELECT id,author,rating,body,created_at FROM reviews WHERE product_id=? ORDER BY id DESC").all(pid) as Row[]).map((r) => ({ id: r.id, author: r.author, rating: r.rating, body: r.body, createdAt: r.created_at })) as Review[];
export const featuredReviews = () =>
  (db().prepare("SELECT id,author,rating,body,created_at FROM reviews WHERE featured=1 ORDER BY id").all() as Row[]).map((r) => ({ id: r.id, author: r.author, rating: r.rating, body: r.body, createdAt: r.created_at })) as Review[];

export const stats = () => ({
  products: (db().prepare("SELECT COUNT(*) c FROM products").get() as any).c as number,
  orders: (db().prepare("SELECT COUNT(*) c FROM orders").get() as any).c as number,
  customers: (db().prepare("SELECT COUNT(*) c FROM users WHERE role='customer'").get() as any).c as number,
  revenue: (db().prepare("SELECT COALESCE(SUM(total),0) s FROM orders WHERE status<>'cancelled'").get() as any).s as number,
});
export const orders = () => (db().prepare(`SELECT o.*, u.name uname, u.email uemail FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC`).all() as Row[]);
export const orderItems = (id: number) => db().prepare("SELECT * FROM order_items WHERE order_id=?").all(id) as Row[];
