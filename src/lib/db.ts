import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";
import { slugify } from "./utils";

const g = globalThis as unknown as { __db?: Database.Database };

function init(): Database.Database {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "store.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL, old_price REAL, category TEXT NOT NULL DEFAULT 'phones', style TEXT NOT NULL DEFAULT 'everyday',
    device TEXT NOT NULL DEFAULT 'phone', tint TEXT NOT NULL DEFAULT '#1f2937',
    colors TEXT NOT NULL DEFAULT '[]', sizes TEXT NOT NULL DEFAULT '[]', images TEXT NOT NULL DEFAULT '[]',
    stock INTEGER NOT NULL DEFAULT 50, is_new INTEGER NOT NULL DEFAULT 0, is_top INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, author TEXT NOT NULL, rating INTEGER NOT NULL,
    body TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), subtotal REAL NOT NULL,
    discount REAL NOT NULL DEFAULT 0, delivery REAL NOT NULL DEFAULT 0, total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    ship_name TEXT, ship_phone TEXT, ship_address TEXT, ship_city TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL, name TEXT NOT NULL, price REAL NOT NULL,
    qty INTEGER NOT NULL, color TEXT, size TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_products_flags ON products(active, is_new, is_top);
  CREATE INDEX IF NOT EXISTS idx_products_style ON products(style, category);
  CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);
  CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS registration_codes (
    email TEXT PRIMARY KEY, name TEXT NOT NULL, password_hash TEXT NOT NULL,
    code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, sent_at INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS admin_login_codes (
    token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, sent_at INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0, session_version INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS password_reset_codes (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, code_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL, sent_at INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0, session_version INTEGER NOT NULL
  );
  `);
  const columns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  if (!columns.some(c => c.name === "disabled")) db.exec("ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0");
  if (!columns.some(c => c.name === "session_version")) db.exec("ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0");
  seed(db);
  return db;
}

type Seed = [string, string, number, number | null, string, string, string, string, string[], string[], number, number];
function seed(db: Database.Database) {
  const email = process.env.ADMIN_EMAIL || "admin@shop.co";
  const pass = process.env.ADMIN_PASSWORD || "Admin123!";
  if (!db.prepare("SELECT 1 FROM users WHERE role='admin'").get()) {
    db.prepare("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?, 'admin')").run("Store Admin", email, bcrypt.hashSync(pass, 10));
  }
  if ((db.prepare("SELECT COUNT(*) c FROM products").get() as { c: number }).c > 0) return;

  const ph = ["128GB", "256GB", "512GB"], lp = ["512GB", "1TB", "2TB"], sm = ["128GB", "256GB"], none: string[] = [];
  // name, desc, price, oldPrice, category, use, device, tint, colors, options, isNew, isTop
  const items: Seed[] = [
    ["Lumen X1 Smartphone", "6.7-inch OLED display at 120 Hz, a 50 MP main camera and a battery that lasts a full day and a half of mixed use.", 799, null, "phones", "everyday", "phone", "#1f2937", ["black", "silver", "blue"], ph, 1, 0],
    ["Lumen Mini 5G", "A compact 5.9-inch phone with the same chip as the X1. Fits one-handed and charges to 60% in 20 minutes.", 549, 599, "phones", "everyday", "phone", "#8fb4d9", ["blue", "white"], sm, 1, 0],
    ["Aeris Pro 14 Laptop", "14-inch 2.8K display, 32 GB unified memory and up to 18 hours of battery. Machined aluminium body at 1.4 kg.", 1399, null, "laptops", "work", "laptop", "#9aa3ad", ["silver", "graphite"], lp, 1, 0],
    ["Aeris Air 13 Ultrabook", "Fanless and silent. A 13.3-inch laptop that weighs 1.1 kg and handles documents, video calls and light editing.", 1049, 1199, "laptops", "work", "laptop", "#cfd3d8", ["silver", "gold"], ["256GB", "512GB"], 1, 0],
    ["Halo ANC Wireless Headphones", "Adaptive noise cancelling, 40 mm drivers and 38 hours of playback. Multipoint Bluetooth connects to two devices at once.", 249, 299, "audio", "everyday", "headphones", "#2b2b2b", ["black", "white", "sand"], none, 0, 1],
    ["Pebble Earbuds Pro", "In-ear noise cancelling with a wireless charging case. IPX4 rated and six hours of listening per charge.", 129, null, "audio", "everyday", "earbuds", "#e5e7eb", ["white", "black"], none, 0, 1],
    ["Orbit Mini Bluetooth Speaker", "Palm-sized speaker with 360-degree sound, a waterproof IP67 shell and 14 hours of battery.", 79, 99, "audio", "everyday", "speaker", "#3d5a80", ["blue", "black", "red"], none, 0, 1],
    ["Pulse Watch S2", "Always-on AMOLED display, built-in GPS, sleep and heart-rate tracking, and a 9-day battery.", 299, 349, "wearables", "everyday", "watch", "#171717", ["black", "silver"], none, 0, 1],
    ["Vertex Pad 11 Tablet", "11-inch 120 Hz screen with stylus support. Four speakers and a keyboard case sold separately.", 499, null, "tablets", "creative", "tablet", "#6b7280", ["graphite", "silver"], sm, 0, 0],
    ["Vertex Slate 8 Mini", "8.3-inch tablet that fits a jacket pocket. Ideal for reading, sketching and travel.", 329, 379, "tablets", "everyday", "tablet", "#9ca3af", ["silver", "blue"], sm, 0, 0],
    ["Vertex Wireless Controller", "Hall-effect sticks that do not drift, remappable back buttons and 30 hours of battery. Works with PC, console and mobile.", 69, null, "gaming", "gaming", "controller", "#1e3a8a", ["black", "white", "blue"], none, 0, 0],
    ["Strike Gaming Headset", "Detachable boom microphone, 50 mm drivers and a memory-foam headband for long sessions.", 109, 139, "gaming", "gaming", "headphones", "#14532d", ["black", "green"], none, 0, 0],
    ["Nova Mirrorless Camera 24MP", "24 MP APS-C sensor, 4K video at 30 fps and in-body stabilisation. Kit lens included.", 1199, 1349, "cameras", "creative", "camera", "#1f1f1f", ["black", "silver"], none, 0, 0],
    ["Nova Action Cam 4K", "Waterproof to 10 m without a case, 4K at 60 fps and electronic stabilisation for rough rides.", 229, null, "cameras", "creative", "camera", "#374151", ["black", "orange"], none, 0, 0],
    ["Lumen Fit Band 3", "Slim fitness band with a 14-day battery, SpO2 and step tracking, and swim-proof to 50 m.", 59, null, "wearables", "everyday", "watch", "#ef4444", ["red", "black", "pink"], none, 0, 0],
  ];
  const ins = db.prepare(`INSERT INTO products (slug,name,description,price,old_price,category,style,device,tint,colors,sizes,is_new,is_top)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const tx = db.transaction(() => {
    for (const it of items) ins.run(slugify(it[0]), it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7], JSON.stringify(it[8]), JSON.stringify(it[9]), it[10], it[11]);
    const rv = db.prepare("INSERT INTO reviews (product_id,author,rating,body,featured) VALUES (?,?,?,?,?)");
    const authors = ["Nino K.", "Luka M.", "Tamar B.", "Giorgi S.", "Ana P.", "Dato R.", "Mariam L.", "Sandro V."];
    const bodies = [
      "Setup took five minutes and it has run without a single hiccup for weeks. Build quality feels well above the price.",
      "Ordered on Monday, delivered on Thursday, and the box had everything listed. Battery life matches the spec sheet.",
      "I compared it against two pricier options and kept this one. Does everything I need and the screen is excellent.",
      "Good value. The software is clean with no bloat and the first update installed without trouble.",
      "Bought it for work and it has not slowed down once. Fan noise is basically zero.",
      "Gave it as a gift and it was a hit. Packaging was solid and the warranty terms are clear.",
    ];
    for (let p = 1; p <= items.length; p++) for (let i = 0; i < 4; i++)
      rv.run(p, authors[(p + i) % authors.length], i === 3 ? 4 : 5 - (i % 2 === 1 && p % 3 === 0 ? 1 : 0), bodies[(p + i) % bodies.length], p <= 6 && i === 0 ? 1 : 0);
  });
  tx();
}

export const db = (): Database.Database => (g.__db ??= init());
