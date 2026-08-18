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

### Auth (admin login)

1. **Authentication → Providers** → Email stays on.
2. Turn **off** “Confirm email” for the first admin if you want faster setup (turn it back on later if you prefer).
3. **Authentication → Users → Add user**
   - Email: the owner’s Gmail (or `beamysignature25@gmail.com`)
   - Password: give her a simple password in person, then she can change it
4. There is no public registration. Only users you create can open `/admin`.
5. Optional but recommended: run `supabase/patch-admins.sql`, then insert the owner's email:

```sql
insert into public.catalogue_admins (email) values ('beamysignature25@gmail.com')
on conflict (email) do nothing;
```

Also set `ADMIN_EMAILS` to that same address on both Vercel projects so only the owner can open the catalogue.

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
| `ADMIN_EMAILS` | the owner's login email, e.g. `beamysignature25@gmail.com` |

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
| Public website | `https://beamy-web.vercel.app` |
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
2. Project name: `beamy-web`.
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
| `ADMIN_EMAILS` | the owner's login email |

6. Deploy. Use the URL Vercel shows, for example `https://beamy-web.vercel.app`.

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
| `NEXT_PUBLIC_SITE_URL` | the website Vercel URL, e.g. `https://beamy-web.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase (same as the website) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase (same as the website) |
| `ADMIN_EMAILS` | the owner's login email (same as the website) |

5. Deploy. Use the URL Vercel shows, for example `https://beamy-cms.vercel.app`. Visiting `/` on this project redirects to `/admin`.

#### 4. Tell Supabase about both URLs

**Authentication → URL configuration**

- **Site URL:** `https://beamy-cms.vercel.app` (login lives on the CMS)
- **Redirect URLs:**
  - `https://beamy-cms.vercel.app/**`
  - `https://beamy-web.vercel.app/**`

Replace those hostnames with the real Vercel URLs from each project. Create the admin user under **Authentication → Users** if you have not already.

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
