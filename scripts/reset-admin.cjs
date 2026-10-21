// Local recovery only. Never called automatically during startup or deployment.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { loadEnvConfig } = require('@next/env');

async function main() {
  loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!/^\S+@\S+\.\S+$/.test(email) || email === 'admin@shop.co') throw Error('Set ADMIN_EMAIL to your real mailbox in .env.local first.');
  if (password.length < 8) throw Error('Set ADMIN_PASSWORD to at least eight characters in .env.local first.');
  const file = path.join(process.cwd(), 'data', 'store.db');
  if (!fs.existsSync(file)) throw Error('Existing store database not found. No account was changed.');
  const db = new Database(file, { fileMustExist: true });
  try {
    const admins = db.prepare("SELECT id,email FROM users WHERE role='admin' ORDER BY id").all();
    const target = admins.find(u => u.email.toLowerCase() === email) || (admins.length === 1 ? admins[0] : null);
    if (!target) throw Error('Cannot identify one existing admin. No account was changed.');
    const conflict = db.prepare('SELECT id,role FROM users WHERE lower(email)=? AND id<>?').get(email, target.id);
    // Recover into the owner's already-registered account without merging identities or orders.
    if (conflict && !(admins.length === 1 && target.email === 'admin@shop.co' && conflict.role === 'customer')) throw Error('The new email already belongs to another account. No account was changed.');
    const recoveryId = conflict ? conflict.id : target.id;
    const unchangedTables = ['products', 'orders', 'order_items', 'reviews', 'subscribers'];
    const snapshot = () => unchangedTables.map(t => JSON.stringify(db.prepare(`SELECT * FROM ${t} ORDER BY rowid`).all()));
    const before = snapshot();
    fs.mkdirSync('backups', { recursive: true });
    const backup = path.join('backups', `store-before-admin-reset-${Date.now()}.db`);
    await db.backup(backup);
    const passwordHash = bcrypt.hashSync(password, 12);
    db.transaction(() => {
      const columns = db.prepare('PRAGMA table_info(users)').all();
      if (!columns.some(c => c.name === 'disabled')) db.exec('ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0');
      if (!columns.some(c => c.name === 'session_version')) db.exec('ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0');
      if (conflict) db.prepare('UPDATE users SET disabled=1,session_version=session_version+1 WHERE id=?').run(target.id);
      db.prepare("UPDATE users SET email=?,password_hash=?,role='admin',disabled=0,session_version=session_version+1 WHERE id=?").run(email, passwordHash, recoveryId);
      if (db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='admin_login_codes'").get()) db.prepare('DELETE FROM admin_login_codes WHERE user_id IN (?,?)').run(target.id, recoveryId);
      if (db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='registration_codes'").get()) db.prepare('DELETE FROM registration_codes WHERE email IN (?,?)').run(target.email, email);
      const updated = db.prepare('SELECT * FROM users WHERE id=?').get(recoveryId);
      assert.equal(updated.email, email);
      assert.equal(updated.role, 'admin');
      assert(bcrypt.compareSync(password, updated.password_hash));
      assert.deepEqual(snapshot(), before);
    })();
    console.log('Existing admin credentials updated from local environment. Password verified; old sessions and pending codes invalidated.');
    if (conflict) console.log('Existing account at the configured email promoted to admin; old placeholder admin disabled. Account histories retained separately.');
    console.log('Products, orders, reviews and subscribers unchanged. Backup: ' + backup);
  } finally { db.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
