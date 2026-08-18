-- BEAMY catalogue schema
-- Paste into the Supabase SQL editor, then run seed.sql.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.gender as enum ('men', 'women', 'unisex');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.price_display_mode as enum ('fixed', 'from', 'on_request');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  gender public.gender not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  gender public.gender,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  additional_info text,
  price numeric(12, 2),
  price_display_mode public.price_display_mode not null default 'fixed',
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  gender public.gender not null,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  whatsapp_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  image_url text,
  role text,
  location text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists public.site_settings (
  id uuid primary key,
  phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  instagram_fashion text not null default '',
  instagram_woman text not null default '',
  address text not null default '',
  hero_headline text not null default '',
  hero_subheadline text not null default '',
  about_short text not null default '',
  about_long text not null default '',
  footer_tagline text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_images enable row level security;
alter table public.hero_images enable row level security;
alter table public.site_settings enable row level security;

-- Optional lock: if this table has rows, only those emails can save.
-- Leave it empty so anyone who signs up can keep the catalogue current.
create table if not exists public.catalogue_admins (
  email text primary key
);

alter table public.catalogue_admins enable row level security;

create or replace function public.is_catalogue_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    not exists (select 1 from public.catalogue_admins)
    or exists (
      select 1 from public.catalogue_admins a
      where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

revoke all on function public.is_catalogue_admin() from public;
grant execute on function public.is_catalogue_admin() to authenticated;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read collections" on public.collections;
create policy "public read collections" on public.collections for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "admin write collections" on public.collections;
create policy "admin write collections" on public.collections for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read product images" on public.product_images;
create policy "public read product images" on public.product_images for select using (
  exists (
    select 1 from public.products p
    where p.id = product_id and (p.published = true or auth.role() = 'authenticated')
  )
);

drop policy if exists "admin write product images" on public.product_images;
create policy "admin write product images" on public.product_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read gallery" on public.gallery_images;
create policy "public read gallery" on public.gallery_images for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "admin write gallery" on public.gallery_images;
create policy "admin write gallery" on public.gallery_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read hero" on public.hero_images;
create policy "public read hero" on public.hero_images for select using (published = true or auth.role() = 'authenticated');

drop policy if exists "admin write hero" on public.hero_images;
create policy "admin write hero" on public.hero_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('collection-images', 'collection-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('hero-images', 'hero-images', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (
  bucket_id in ('product-images', 'collection-images', 'testimonial-images', 'hero-images')
);

drop policy if exists "admin write media" on storage.objects;
create policy "admin write media" on storage.objects for all to authenticated using (
  bucket_id in ('product-images', 'collection-images', 'testimonial-images', 'hero-images')
  and public.is_catalogue_admin()
) with check (
  bucket_id in ('product-images', 'collection-images', 'testimonial-images', 'hero-images')
  and public.is_catalogue_admin()
);
