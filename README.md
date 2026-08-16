# BEAMY

BEAMY is a Lagos unisex fashion house for bespoke and made-to-measure clothing. This repository holds the public catalogue website and the private BEAMY Catalogue used to keep designs, collections and homepage images up to date.

Orders are completed on WhatsApp. There is no card checkout.

## What is included

- A public website for collections, individual designs, about, contact and a bag that opens WhatsApp
- A private catalogue at `/admin` for adding designs, photos, collections, categories, testimonials and site details
- Optional split builds, so the website and the catalogue can be deployed as two Vercel projects (for example `beamy.fashion` and `catalogue.beamy.fashion`)

## Local development

```bash
npm install
npm run dev
```

Then open:

- Website: [http://localhost:3000](http://localhost:3000)
- Catalogue: [http://localhost:3000/admin](http://localhost:3000/admin)

To run them separately:

```bash
npm run dev:web      # website only, port 3000
npm run dev:admin    # catalogue only, port 3001
```

Copy `.env.example` to `.env.local` when you are ready to connect Supabase. Until those keys are set, the app uses a local mock catalogue so you can design and review the site.

## Catalogue

The catalogue is written for a non-technical owner. Language stays simple: **Add New Design**, **All Designs**, **Homepage images**.

Without Supabase, changes are stored on this computer only. Before going live, create a Supabase project, run `supabase/schema.sql` and `supabase/seed.sql`, add an Auth user, and set the environment variables. Full steps are in [DEPLOY.md](./DEPLOY.md).

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Supabase, Vercel, custom domains and the optional website-plus-subdomain catalogue setup.
