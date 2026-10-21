import { DEVICES, USES } from "./utils";

export function parseProduct(b: any) {
  const name = String(b.name || "").trim();
  const price = Number(b.price);
  if (name.length < 2) return { error: "Product name is required." };
  if (!(price > 0)) return { error: "Price must be greater than zero." };
  const old = b.oldPrice === "" || b.oldPrice == null ? null : Number(b.oldPrice);
  if (old != null && !(old > price)) return { error: "Old price must be higher than the current price, or left empty." };
  const arr = (v: any) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);
  return {
    row: {
      name, description: String(b.description || ""), price, old_price: old,
      category: String(b.category || "phones").toLowerCase(),
      style: (USES as readonly string[]).includes(b.style) ? b.style : "everyday",
      device: (DEVICES as readonly string[]).includes(b.device) ? b.device : "phone",
      tint: /^#[0-9a-f]{6}$/i.test(b.tint) ? b.tint : "#1f2937",
      colors: JSON.stringify(arr(b.colors)), sizes: JSON.stringify(arr(b.sizes)), images: JSON.stringify(arr(b.images)),
      stock: Math.max(0, parseInt(b.stock) || 0), is_new: b.isNew ? 1 : 0, is_top: b.isTop ? 1 : 0, active: b.active === false ? 0 : 1,
    },
  };
}
