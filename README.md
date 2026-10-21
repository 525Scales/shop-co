# SHOP.CO - electronics store

Next.js 14 (App Router) + Tailwind 3 + SQLite (better-sqlite3) + Framer Motion + Phosphor icons.

## Run
    npm install
    cp .env.example .env.local   # set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
    npm run dev                  # http://localhost:3000

The database (`data/store.db`) is created and seeded on first request: 15 electronics products, reviews and one admin account
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`, default `admin@shop.co` / `Admin123!`). Change these before deploying.

## Included
- Home, shop (filters: category, price, color, storage, best-for; sort; pagination; search), product detail (gallery, color/size, reviews, FAQ, related), cart, checkout, order confirmation
- Register / login (bcrypt + signed httpOnly JWT cookie), route protection in `src/middleware.ts`
- Admin at `/admin`: overview, products (create, edit, delete, hide, upload photos, flag New Arrivals / Top Selling), orders (status updates)
- Mobile responsive, with nav drawer and filter bottom sheet

## Notes
- Hero photo: drop a file at `public/hero.jpg` (about 900x1000). Without it an illustrated composition is shown.
- Products without photos render an illustrated device (device type and tint set in admin). Uploads go to `public/uploads`, which needs a writable disk; use object storage on serverless hosts.
- Fonts load at runtime from Google Fonts (Archivo, expanded width) and Fontshare (Satoshi).
- Prices are recalculated on the server at checkout. Payment is cash on delivery; add a gateway in `src/app/api/orders/route.ts`.
- Brand names in the strip are fictional.

## Performance
`npm run dev` compiles each page the first time you open it, so it always feels slow. For real speed use:

    npm run build && npm start

Home, cart, login, register and product pages are cached (refreshed every 60 s and instantly when an admin or customer changes data).

Keep `data/store.db` and `data/uploads` across builds and deployments. Never replace the data directory with an empty copy. Existing products prevent catalogue seeding. Use a persistent disk when hosting this SQLite app.

## Gmail and verification
Password recovery is available from “Forgot password?” on login at `/forgot-password`. Users request a branded email code, then enter it with a new password in the same browser. Codes expire after 10 minutes, allow five attempts, and can be resent after one minute. Request responses do not disclose whether an account exists. Codes are stored as hashes bound to a random httpOnly browser cookie. A successful reset consumes the code, invalidates existing sessions and pending admin codes, and returns the user to login. Admin 2FA remains required. Disabled accounts cannot reset their passwords. No product or order data is changed.

To recover an existing admin account, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`, then run `node scripts/reset-admin.cjs` locally from this project. The command backs up the database, updates the existing admin, and revokes old sessions and codes without deleting store data. If the sole admin is the placeholder `admin@shop.co` and the configured email belongs to an existing customer, it promotes that account and disables the placeholder, preserving both account histories separately. Other email conflicts and ambiguous admin selection are refused. This is a manual recovery command; environment edits alone do not update existing credentials.

Admin login requires the existing password followed by an emailed code, valid for 10 minutes with five attempts. The code is bound to an httpOnly browser challenge cookie; password-only admin sessions no longer work. Codes are sent to the admin's email stored in the database, so replace placeholder admin email addresses with a monitored mailbox before use. `ADMIN_EMAIL` only sets the first seeded admin; changing the environment variable does not update existing users.

`/admin/users` lists accounts with name/email search, role filtering, order counts, name editing, role changes and disabling/re-enabling access. Account emails are read-only. Disabling accounts and changing roles revokes existing sessions and pending admin codes. Admins cannot disable or demote themselves, and at least one active admin must remain. No accounts, orders or reviews are deleted.

Product search now offers up to six live suggestions after a short typing delay, on desktop and in the mobile drawer. Arrow keys select suggestions, Enter opens a selection or searches, and Escape dismisses. Search matches words across name, description and category, ignores extra whitespace, treats SQL wildcard characters literally, and only returns active products.

Run `node scripts/check-admin-search.cjs` for isolated admin security, user management and search integration checks.

Both verification and newsletter welcome emails include branded HTML and plain-text alternatives. Set `SITE_URL` to your public HTTPS store address to enable the newsletter’s shop button. Without it, the email omits the button. Templates live in `src/lib/emailTemplates.ts` and use inline styling and presentation tables for email clients.

Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local` (or server environment variables), then restart the app. Use a Google App Password, not your normal Google password. Google requires 2-Step Verification for App Passwords: https://support.google.com/mail/answer/185833

New registrations receive a six-digit code, valid for 10 minutes with at most five attempts. Account creation and sign-in happen only after verification. Requesting another code has a one-minute cooldown. Existing accounts are preserved and keep password login. Newsletter signup sends a welcome email; duplicate subscriptions do not send another email. Monitor replies to the Gmail sender and remove subscribers who request unsubscribe before sending campaigns.

Terms are at `/terms`; missing routes use the custom 404 page. Review the terms and supply your business contact details and policies before launch.

## Data backup
The pre-change database backup is `backups/store-before-email.db`; photos are in `backups/uploads-before-email`. The SQLite backup API was used to include committed WAL data. These backups contain private store data: keep them private and outside version control. For future backups use SQLite's backup API while the app runs, and copy `data/uploads` alongside the database. To restore, stop the app, preserve the current data directory, restore the backup database as `data/store.db` into a clean data directory, restore uploads as `data/uploads`, then restart. Do not combine a restored database with old WAL/SHM files.
