# BEAMY — Deploy, Supabase and go-live

This is the checklist to take the site from this computer to a live URL the client can use.

## 0. What is already done

- Public website and `/admin` catalogue
- WhatsApp order + bag checkout
- Photo upload from phone
- Homepage image manager

Local saves currently go into `data/cms.json` and `public/uploads`. That is fine for development only. **Production must use Supabase**, or photos and catalogue edits will disappear on the next deploy.

### Where catalogue data lives

| Environment | Products, collections, categories, testimonials, homepage images, settings |
|---|---|
| This computer, no `.env.local` | `data/cms.json` on this PC (plus photos in `public/uploads`) |
| This computer or Vercel, with Supabase keys | Your Supabase Postgres database (photos in Supabase Storage) |

The public website and the catalogue must share the same Supabase project. If the keys are missing on Vercel, the live site falls back to the built-in mock seed and admin changes will not stick.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. **New project** → name it `beamy`.
3. Set a strong database password and save it somewhere safe.
4. Choose a region close to Nigeria if available (otherwise West EU).
5. Wait until the project is ready.

### Copy keys

In Supabase: **Project Settings → API**

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create a file `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart `npm run dev` after saving.

---

## 2. Database, storage and seed

In Supabase: **SQL Editor → New query**

1. Paste and run `supabase/schema.sql` (creates tables, policies and storage buckets).
2. Paste and run `supabase/seed.sql` (loads mock catalogue, categories, testimonials and homepage images).

If a statement errors because something already exists, you can usually ignore that and continue.

### Auth (sign in, sign up, forgot password)

1. **Authentication → Providers → Email** stays on.
2. Turn **on** “Allow new users to sign up”.
3. “Confirm email” can stay on. After sign up, the person checks their inbox, then signs in. Turn it off only if you want them to enter the catalogue immediately.
4. People create their own accounts at `/admin/signup`. Existing accounts use **Forgot password** at `/admin/forgot-password`.
5. Leave `catalogue_admins` empty. If that table has any email rows, only those emails can save — new sign-ups can open the catalogue but cannot publish. If you previously inserted an owner email, run `supabase/unlock-catalogue-admins.sql`.

Do **not** set `ADMIN_EMAILS`. The catalogue no longer locks to one owner address.

### Branded emails

Supabase will not let you paste custom templates until **custom SMTP** is on. That form is **not** a login to the client’s Gmail. Do not put `beamysignature25@gmail.com` in Host / Username / Password — Gmail will not send through that screen without her password, and a third-party host cannot send *as* `@gmail.com`.

Use a sending service on **your** account (Resend is the simplest). Sender name can still be `Beamy`.

1. Create a free account at [https://resend.com](https://resend.com) with **your** email.
2. **Domains → Add** a domain you control, add the DNS records Resend shows, wait until it is verified. You cannot verify `gmail.com`.
3. **API Keys → Create** (permission: Sending access). Copy the `re_…` key once.
4. In Supabase, **Authentication → SMTP / Notifications → SMTP Settings**:

| Field | Value |
|---|---|
| Sender email | `catalogue@your-verified-domain.com` (must be on the Resend domain) |
| Sender name | `Beamy` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | the Resend API key (`re_…`) |
| Minimum interval | `60` is fine |

5. Save. Then paste the templates:

   - **Confirm signup** — subject `Confirm your BEAMY Catalogue email` — body `supabase/emails/confirm-signup.html`
   - **Reset password** — subject `Reset your BEAMY Catalogue password` — body `supabase/emails/reset-password.html`

Keep `{{ .ConfirmationURL }}` in the templates. That is the confirm / reset link.

If the client later wants mail to come from `beamysignature25@gmail.com`, she can create a Gmail **App Password** (Google Account → Security → App passwords) and send you only that 16-character password. Then Host `smtp.gmail.com`, Port `587`, Username her Gmail, Password the app password. You still never log into her inbox.

---

## 3. Check it locally with Supabase

```bash
npm install
npm run dev
```

Open:

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Sign in with the user you created. Add a design with a phone photo and confirm it appears on the public site.

---

## 4. GitHub (needed for Vercel)

If the folder is not a Git repo yet:

```bash
git init
git add .
git commit -m "BEAMY website"
```

Create a GitHub repository and push the `main` branch.

Do **not** commit `.env.local`.

---

## 5. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and import the GitHub repo.
2. Framework: Next.js (auto-detected).
3. **Environment variables** (Production + Preview):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |
| `NEXT_PUBLIC_SITE_URL` | this project's `*.vercel.app` URL (after first deploy you can add it and redeploy) |

4. Deploy.
5. After the first deploy, add the live URL in Supabase:

**Authentication → URL configuration**

- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/**`

There is no custom domain. Use the `*.vercel.app` addresses Vercel gives you.

### Split website and CMS (two Vercel projects)

One Vercel project can serve both the public site and `/admin`. To keep them separate, create **two Vercel projects from the same GitHub repo**. Each one gets its own `*.vercel.app` URL. No domain purchase or DNS is required.

Example:

| App | URL |
|---|---|
| Public website | `https://beamy-eight.vercel.app` |
| Catalogue / CMS | `https://beamy-cms.vercel.app` |

Vercel assigns the exact names. Copy them from **Project → Settings → Domains** after each deploy.

#### 1. Push the repo to GitHub

```bash
git init
git add .
git commit -m "BEAMY website"
```

Create a GitHub repository, push `main`, and **do not** commit `.env.local`.

#### 2. Website project

1. [vercel.com](https://vercel.com) → **Add New… → Project** → import the GitHub repo.
2. Project name: `beamy-eight` (or whatever Vercel assigns).
3. Framework: Next.js (auto).
4. **Build Command:** `npm run build:web` (override the default `next build`).
5. Environment variables (Production + Preview):

| Name | Value |
|---|---|
| `APP_TARGET` | `web` |
| `NEXT_PUBLIC_APP_TARGET` | `web` |
| `NEXT_PUBLIC_SITE_URL` | this website's `*.vercel.app` URL |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |

6. Deploy. Use the URL Vercel shows, for example `https://beamy-eight.vercel.app`.

`/admin` is hidden on this project.

#### 3. Catalogue project

1. **Add New… → Project** again → import the **same** GitHub repo. Confirm you want a second project.
2. Project name: `beamy-cms`.
3. **Build Command:** `npm run build:admin`.
4. Environment variables (Production + Preview):

| Name | Value |
|---|---|
| `APP_TARGET` | `admin` |
| `NEXT_PUBLIC_APP_TARGET` | `admin` |
| `NEXT_PUBLIC_SITE_URL` | the website Vercel URL, e.g. `https://beamy-eight.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase (same as the website) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase (same as the website) |

5. Deploy. Use the URL Vercel shows, for example `https://beamy-cms.vercel.app`. Visiting `/` on this project redirects to `/admin`.

#### 4. Tell Supabase about both URLs

**Authentication → URL configuration**

- **Site URL:** `https://beamy-cms.vercel.app` (login lives on the CMS)
- **Redirect URLs:**
  - `https://beamy-cms.vercel.app/**`
  - `https://beamy-eight.vercel.app/**`
  - `http://localhost:3000/**`
  - `http://localhost:3001/**`

Replace those hostnames with the real Vercel URLs from each project. Confirm email sign-ups are allowed under **Authentication → Providers → Email**.

#### 5. Check it

- Website Vercel URL — public site. `/admin` should 404.
- Catalogue Vercel URL — catalogue login / dashboard.
- Add a design in the CMS and confirm it appears on the public site (same Supabase project).

On this computer:

```bash
npm run dev          # website + catalogue together (http://localhost:3000)
npm run dev:web      # website only, port 3000
npm run dev:admin    # catalogue only, port 3001
```

---

## 6. After go-live — client tasks

Do these with the owner, on her phone:

1. Log into `/admin/login`.
2. **Site settings** — confirm phone, WhatsApp (`08101657472`), email, Instagram, address.
3. **Homepage images** — replace mock photos with real BEAMY pictures.
4. **Designs** — unpublish or delete mock pieces, then **Add New Design** with real names, prices and photos.
5. **Testimonials** — replace mock quotes with real client notes, or unpublish them.
6. Send herself a test WhatsApp order from the bag checkout.

---

## 7. How she uses the catalogue

- **Add New Design** → name, photos, price, men/women, published.
- **Show on homepage** = Featured.
- **Draft** = public cannot see it.
- **Homepage images** = the rotating banner.
- **Lookbook gallery** = the photo grid on the homepage.
- Men and Women collections cannot be deleted, and their web addresses cannot change.
- Delete always asks for confirmation.

---

## 8. WhatsApp checkout

The bag is stored in the visitor’s browser. Checkout opens WhatsApp with:

- numbered items
- quantity, unit price, line total
- order total (and a note if anything is price-on-request)
- name, phone, address, occasion, notes

No card payment is collected on the site.

---

## 9. Optional later

- A custom domain, if one is purchased later
- Google Search Console
- Real product photography
- Measurement guide PDF
- Extra admin user
- Switch “Confirm email” back on for Auth

---

## 10. If something breaks

| Problem | Check |
|---|---|
| Admin login fails | User exists in Supabase Auth; env vars are set on Vercel |
| Photos do not appear | Storage buckets exist and are public; policies from `schema.sql` |
| Catalogue empty | `seed.sql` was run, or she unpublished everything |
| WhatsApp opens wrong number | Site settings → WhatsApp number, then save |
| Changes vanish after deploy | Supabase env vars missing — the site fell back to seed/local data |
