-- Fill the live catalogue with working mock photographs stored in /public/mock.
-- These files ship with the website, so they load even if Unsplash is down.
-- Safe to run more than once.

delete from public.product_images where url ilike '%unsplash.com%';
delete from public.hero_images where url ilike '%unsplash.com%';
delete from public.gallery_images where url ilike '%unsplash.com%';

update public.collections
set image_url = '/mock/collection-men.jpg'
where slug = 'men' or (image_url is null and gender = 'men');

update public.collections
set image_url = '/mock/collection-women.jpg'
where slug = 'women' or (image_url is null and gender = 'women');

update public.collections
set image_url = '/mock/collection-executive.jpg'
where slug = '2026-executive' or (image_url is null and coalesce(gender, 'unisex') = 'unisex');

update public.testimonials
set image_url = case (abs(hashtext(id::text)) % 4)
  when 0 then '/mock/portrait-1.jpg'
  when 1 then '/mock/portrait-2.jpg'
  when 2 then '/mock/portrait-3.jpg'
  else '/mock/portrait-4.jpg'
end
where image_url is null or image_url ilike '%unsplash.com%';

insert into public.hero_images (id, url, alt, sort_order, published) values
  ('e2000001-0000-4000-8000-000000000001', '/mock/hero-1.jpg', 'BEAMY menswear, tailored for presence', 1, true),
  ('e2000001-0000-4000-8000-000000000002', '/mock/hero-2.jpg', 'Signature black suiting', 2, true),
  ('e2000001-0000-4000-8000-000000000003', '/mock/hero-3.jpg', 'Occasion tailoring in deep burgundy', 3, true),
  ('e2000001-0000-4000-8000-000000000004', '/mock/hero-4.jpg', 'Structured womenswear', 4, true),
  ('e2000001-0000-4000-8000-000000000005', '/mock/hero-5.jpg', 'Camel cloth, city light', 5, true),
  ('e2000001-0000-4000-8000-000000000006', '/mock/hero-6.jpg', 'A quiet, considered silhouette', 6, true)
on conflict (id) do update set url = excluded.url, alt = excluded.alt, published = true;

insert into public.gallery_images (id, url, alt, sort_order, published) values
  ('e1000001-0000-4000-8000-000000000001', '/mock/gallery-1.jpg', 'Tailored presence', 1, true),
  ('e1000001-0000-4000-8000-000000000002', '/mock/gallery-2.jpg', 'Urban outerwear', 2, true),
  ('e1000001-0000-4000-8000-000000000003', '/mock/gallery-3.jpg', 'Occasion gowns', 3, true),
  ('e1000001-0000-4000-8000-000000000004', '/mock/gallery-4.jpg', 'Camel tailoring', 4, true),
  ('e1000001-0000-4000-8000-000000000005', '/mock/gallery-5.jpg', 'The house showroom', 5, true),
  ('e1000001-0000-4000-8000-000000000006', '/mock/gallery-6.jpg', 'Cloth on the rail', 6, true)
on conflict (id) do update set url = excluded.url, alt = excluded.alt, published = true;

insert into public.product_images (id, product_id, url, alt, sort_order)
select v.id, v.product_id, v.url, v.alt, v.sort_order
from (values
  ('a1000001-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000001'::uuid, '/mock/product-01.jpg', 'BEAMY Signature Black Suit', 1),
  ('a1000002-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000002'::uuid, '/mock/product-02.jpg', 'Ivory Executive Agbada', 1),
  ('a1000003-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000003'::uuid, '/mock/product-03.jpg', 'Midnight Senator Kaftan', 1),
  ('a1000004-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000004'::uuid, '/mock/product-04.jpg', 'White Custom Dress Shirt', 1),
  ('a1000005-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000005'::uuid, '/mock/product-05.jpg', 'Charcoal Corporate Trousers', 1),
  ('a1000006-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000006'::uuid, '/mock/product-06.jpg', 'Olive Structured Two-Piece', 1),
  ('a1000007-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000007'::uuid, '/mock/product-07.jpg', 'Urban Structured Jacket', 1),
  ('a1000008-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000008'::uuid, '/mock/product-08.jpg', 'Navy Boardroom Suit', 1),
  ('a1000008-0000-4000-8000-000000000002'::uuid, 'c1000001-0000-4000-8000-000000000008'::uuid, '/mock/product-08b.jpg', 'Navy boardroom suit styling', 2),
  ('a1000009-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000009'::uuid, '/mock/product-09.jpg', 'Ivory Boardroom Gown', 1),
  ('a1000010-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000010'::uuid, '/mock/product-10.jpg', 'Burgundy Executive Two-Piece', 1),
  ('a1000011-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000011'::uuid, '/mock/product-11.jpg', 'Camel Tweed Suit', 1),
  ('a1000012-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000012'::uuid, '/mock/product-12.jpg', 'High-Waist Power Suit', 1),
  ('a1000013-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000013'::uuid, '/mock/product-13.jpg', 'Urban Blazer Dress', 1),
  ('a1000014-0000-4000-8000-000000000001'::uuid, 'c1000001-0000-4000-8000-000000000014'::uuid, '/mock/product-14.jpg', 'Draft Ivory Dinner Jacket', 1)
) as v(id, product_id, url, alt, sort_order)
where exists (select 1 from public.products p where p.id = v.product_id)
on conflict (id) do update set url = excluded.url, alt = excluded.alt;

insert into public.product_images (product_id, url, alt, sort_order)
select
  p.id,
  '/mock/product-' || lpad((((row_number() over (order by p.sort_order, p.created_at) - 1) % 14) + 1)::text, 2, '0') || '.jpg',
  p.name,
  1
from public.products p
where not exists (
  select 1 from public.product_images i where i.product_id = p.id
);
