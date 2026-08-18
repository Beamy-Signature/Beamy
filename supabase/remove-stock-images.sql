-- Remove mock Unsplash photos from the live catalogue.
-- Real uploads in Supabase Storage are kept.
-- Safe to run more than once.

delete from public.product_images
where url ilike '%unsplash.com%';

delete from public.gallery_images
where url ilike '%unsplash.com%';

delete from public.hero_images
where url ilike '%unsplash.com%';

update public.collections
set image_url = null
where image_url ilike '%unsplash.com%';

update public.testimonials
set image_url = null
where image_url ilike '%unsplash.com%';
