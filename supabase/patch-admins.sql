-- Optional: tighten catalogue writes to owner emails.
-- Safe to run on an existing project. Until you insert a row, any Auth user
-- you created can still save — same as today.

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

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write collections" on public.collections;
create policy "admin write collections" on public.collections for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write product images" on public.product_images;
create policy "admin write product images" on public.product_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write gallery" on public.gallery_images;
create policy "admin write gallery" on public.gallery_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write hero" on public.hero_images;
create policy "admin write hero" on public.hero_images for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all to authenticated using (public.is_catalogue_admin()) with check (public.is_catalogue_admin());

drop policy if exists "admin write media" on storage.objects;
create policy "admin write media" on storage.objects for all to authenticated using (
  bucket_id in ('product-images', 'collection-images', 'testimonial-images', 'hero-images')
  and public.is_catalogue_admin()
) with check (
  bucket_id in ('product-images', 'collection-images', 'testimonial-images', 'hero-images')
  and public.is_catalogue_admin()
);

-- After this runs, lock writes to the owner by inserting their login email:
-- insert into public.catalogue_admins (email) values ('owner@email.com')
-- on conflict (email) do nothing;
