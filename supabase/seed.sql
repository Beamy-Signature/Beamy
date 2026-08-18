-- Mock catalogue for BEAMY. Run after schema.sql.

insert into public.site_settings (
  id, phone, whatsapp_number, email, instagram_fashion, instagram_woman, address,
  hero_headline, hero_subheadline, about_short, about_long, footer_tagline
) values (
  '00000000-0000-4000-8000-000000000001',
  '08101657472',
  '08101657472',
  'beamysignature25@gmail.com',
  'https://instagram.com/Beamy_fashion',
  'https://instagram.com/Beamy_woman',
  'Lagos, Nigeria',
  'Tailored for Presence.',
  'Contemporary bespoke fashion designed around your style, measurements and lifestyle.',
  'BEAMY is a premium Lagos-based unisex fashion brand creating contemporary, well-structured clothing for men and women. We specialise in bespoke and made-to-measure fashion.',
  'BEAMY is a premium Lagos-based unisex fashion brand creating contemporary, well-structured clothing for men and women. We specialise in bespoke and made-to-measure fashion, combining modern style, refined tailoring, quality fabrics, and clean finishing to create clothing that makes our clients look polished, confident, and distinguished.

Our products are designed for work, weddings, special occasions, professional engagements, and refined everyday wear.

At BEAMY, we believe clothing should do more than fit well — it should communicate confidence, professionalism, individuality, and presence.',
  'Bespoke fashion. Refined presence.'
) on conflict (id) do update set
  phone = excluded.phone,
  whatsapp_number = excluded.whatsapp_number,
  email = excluded.email;

insert into public.categories (id, name, slug, gender, sort_order) values
  ('a1111111-1111-4111-8111-111111111111', 'Bespoke Suits', 'bespoke-suits', 'men', 1),
  ('a1111111-1111-4111-8111-111111111112', 'Agbada', 'agbada', 'men', 2),
  ('a1111111-1111-4111-8111-111111111113', 'Kaftans/Senators', 'kaftans-senators', 'men', 3),
  ('a1111111-1111-4111-8111-111111111114', 'Custom Shirts', 'custom-shirts', 'men', 4),
  ('a1111111-1111-4111-8111-111111111115', 'Corporate Trousers', 'corporate-trousers', 'men', 5),
  ('a1111111-1111-4111-8111-111111111116', 'Two-Piece Sets', 'men-two-piece-sets', 'men', 6),
  ('a1111111-1111-4111-8111-111111111117', 'Urban Jackets', 'urban-jackets', 'men', 7),
  ('b2222222-2222-4222-8222-222222222221', 'Corporate Suits', 'corporate-suits', 'women', 1),
  ('b2222222-2222-4222-8222-222222222222', 'Corporate Gowns/Dresses', 'corporate-gowns-dresses', 'women', 2),
  ('b2222222-2222-4222-8222-222222222223', 'Two-Piece Sets', 'women-two-piece-sets', 'women', 3),
  ('b2222222-2222-4222-8222-222222222224', 'Tweed Suits', 'tweed-suits', 'women', 4),
  ('b2222222-2222-4222-8222-222222222225', 'High-Waist Suits', 'high-waist-suits', 'women', 5),
  ('b2222222-2222-4222-8222-222222222226', 'Contemporary/Urban Pieces', 'contemporary-urban-pieces', 'women', 6)
on conflict (id) do nothing;

insert into public.collections (id, name, slug, description, image_url, gender, published, sort_order) values
  ('11111111-1111-4111-8111-111111111111', 'Men''s Collection', 'men', 'Structured tailoring for work, weddings and refined everyday wear.', '/mock/collection-men.jpg', 'men', true, 1),
  ('22222222-2222-4222-8222-222222222222', 'Women''s Collection', 'women', 'Contemporary silhouettes with a clean, executive finish.', '/mock/collection-women.jpg', 'women', true, 2),
  ('33333333-3333-4333-8333-333333333333', '2026 Executive Collection', '2026-executive', 'A unisex edit of BEAMY''s most considered boardroom and occasion pieces.', '/mock/collection-executive.jpg', 'unisex', true, 3)
on conflict (id) do update set image_url = excluded.image_url;

insert into public.products (
  id, name, slug, description, additional_info, price, price_display_mode,
  category_id, collection_id, gender, featured, published, sort_order
) values
  ('c1000001-0000-4000-8000-000000000001', 'BEAMY Signature Black Suit', 'beamy-signature-black-suit', 'Bespoke two-piece suit crafted for a clean, structured and sophisticated appearance. Cut for presence in the boardroom and after hours.', 'Made to measure. Available in wool and wool-blend finishes. Typical lead time: 2–4 weeks.', 250000, 'fixed', 'a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'men', true, true, 1),
  ('c1000001-0000-4000-8000-000000000002', 'Ivory Executive Agbada', 'ivory-executive-agbada', 'A ceremonial agbada with a quiet, modern line. Designed for weddings, chieftaincy and formal gatherings where presence matters.', 'Hand-finished embroidery available on request.', 180000, 'fixed', 'a1111111-1111-4111-8111-111111111112', '11111111-1111-4111-8111-111111111111', 'men', true, true, 2),
  ('c1000001-0000-4000-8000-000000000003', 'Midnight Senator Kaftan', 'midnight-senator-kaftan', 'A refined senator kaftan in deep midnight. Clean finishing, considered proportions and a tailored drape for evening and occasion wear.', null, 120000, 'fixed', 'a1111111-1111-4111-8111-111111111113', '11111111-1111-4111-8111-111111111111', 'men', false, true, 3),
  ('c1000001-0000-4000-8000-000000000004', 'White Custom Dress Shirt', 'white-custom-dress-shirt', 'A crisp made-to-measure shirt with a clean collar and precise placket. Built as a foundation piece for suits and senators.', 'Collar and cuff options discussed during consultation.', 45000, 'fixed', 'a1111111-1111-4111-8111-111111111114', '11111111-1111-4111-8111-111111111111', 'men', false, true, 4),
  ('c1000001-0000-4000-8000-000000000005', 'Charcoal Corporate Trousers', 'charcoal-corporate-trousers', 'Sharply cut trousers with a clean crease and considered rise. Designed to sit well through a full work day.', null, 55000, 'fixed', 'a1111111-1111-4111-8111-111111111115', '11111111-1111-4111-8111-111111111111', 'men', false, true, 5),
  ('c1000001-0000-4000-8000-000000000006', 'Olive Structured Two-Piece', 'olive-structured-two-piece', 'A contemporary two-piece in olive — jacket and trouser cut as one thought. Relaxed enough for day, sharp enough for appointments.', 'Starting price for standard cloth. Premium fabrics quoted separately.', 150000, 'from', 'a1111111-1111-4111-8111-111111111116', '33333333-3333-4333-8333-333333333333', 'men', true, true, 6),
  ('c1000001-0000-4000-8000-000000000007', 'Urban Structured Jacket', 'urban-structured-jacket', 'A city jacket with a clean shoulder and quiet hardware. Built to layer over shirts, senators and evening looks.', null, 95000, 'fixed', 'a1111111-1111-4111-8111-111111111117', '11111111-1111-4111-8111-111111111111', 'men', false, true, 7),
  ('c1000001-0000-4000-8000-000000000008', 'Navy Boardroom Suit', 'navy-boardroom-suit', 'A women''s corporate suit with a precise shoulder and a clean trouser line. Designed for women who walk into the room already decided.', 'Jacket and trouser made to measure. Skirt option available.', 220000, 'fixed', 'b2222222-2222-4222-8222-222222222221', '22222222-2222-4222-8222-222222222222', 'women', true, true, 8),
  ('c1000001-0000-4000-8000-000000000009', 'Ivory Boardroom Gown', 'ivory-boardroom-gown', 'A structured corporate gown with a clean neckline and a quiet, elongated silhouette. For presentations, dinners and days that need poise.', null, 165000, 'fixed', 'b2222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', 'women', false, true, 9),
  ('c1000001-0000-4000-8000-000000000010', 'Burgundy Executive Two-Piece', 'burgundy-executive-two-piece', 'A two-piece set in deep burgundy. Soft structure, clean finishing and a silhouette that holds through a long day.', 'Starting from selected fabrics.', 140000, 'from', 'b2222222-2222-4222-8222-222222222223', '22222222-2222-4222-8222-222222222222', 'women', true, true, 10),
  ('c1000001-0000-4000-8000-000000000011', 'Camel Tweed Suit', 'camel-tweed-suit', 'A tweed suit with warmth and texture, cut with BEAMY''s clean shoulder and a high, considered waist.', 'Seasonal cloth. Limited fabric runs.', 240000, 'fixed', 'b2222222-2222-4222-8222-222222222224', '33333333-3333-4333-8333-333333333333', 'women', false, true, 11),
  ('c1000001-0000-4000-8000-000000000012', 'High-Waist Power Suit', 'high-waist-power-suit', 'A high-waist suit that lengthens the line and sharpens the stance. Made for women who want structure without stiffness.', null, 230000, 'fixed', 'b2222222-2222-4222-8222-222222222225', '22222222-2222-4222-8222-222222222222', 'women', true, true, 12),
  ('c1000001-0000-4000-8000-000000000013', 'Urban Blazer Dress', 'urban-blazer-dress', 'A contemporary blazer dress for evenings, openings and days that sit between office and occasion. Cloth and finish quoted after consultation.', 'Price depends on fabric and finishing.', null, 'on_request', 'b2222222-2222-4222-8222-222222222226', '22222222-2222-4222-8222-222222222222', 'women', false, true, 13),
  ('c1000001-0000-4000-8000-000000000014', 'Draft Ivory Dinner Jacket', 'draft-ivory-dinner-jacket', 'A draft piece held back from the public catalogue.', null, 175000, 'fixed', 'a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'men', false, false, 14)
on conflict (id) do nothing;

insert into public.testimonials (id, customer_name, quote, image_url, role, location, published, sort_order) values
  ('d1000001-0000-4000-8000-000000000001', 'Adaeze Okonkwo', 'The navy suit arrived exactly as discussed — clean, structured, and I have not stopped receiving compliments at chambers.', '/mock/portrait-1.jpg', 'Corporate lawyer', 'Lagos', true, 1),
  ('d1000001-0000-4000-8000-000000000002', 'Tunde Adebayo', 'BEAMY understood the brief for my wedding agbada without turning it loud. The finish was precise. I felt like myself, only sharper.', '/mock/portrait-2.jpg', 'Entrepreneur', 'Victoria Island', true, 2),
  ('d1000001-0000-4000-8000-000000000003', 'Chioma Eze', 'I needed a look that could go from the office to a dinner. The two-piece was considered, comfortable and very well made.', '/mock/portrait-3.jpg', 'Brand director', 'Ikoyi', true, 3),
  ('d1000001-0000-4000-8000-000000000004', 'Ibrahim Musa', 'Measurements were taken properly, the cloth recommendation was honest, and the senator was ready when they said it would be.', '/mock/portrait-4.jpg', 'Groom', 'Lekki', true, 4)
on conflict (id) do update set image_url = excluded.image_url;

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

insert into public.product_images (id, product_id, url, alt, sort_order) values
  ('a1000001-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000001', '/mock/product-01.jpg', 'BEAMY Signature Black Suit', 1),
  ('a1000002-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000002', '/mock/product-02.jpg', 'Ivory Executive Agbada', 1),
  ('a1000003-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000003', '/mock/product-03.jpg', 'Midnight Senator Kaftan', 1),
  ('a1000004-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000004', '/mock/product-04.jpg', 'White Custom Dress Shirt', 1),
  ('a1000005-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000005', '/mock/product-05.jpg', 'Charcoal Corporate Trousers', 1),
  ('a1000006-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000006', '/mock/product-06.jpg', 'Olive Structured Two-Piece', 1),
  ('a1000007-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000007', '/mock/product-07.jpg', 'Urban Structured Jacket', 1),
  ('a1000008-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000008', '/mock/product-08.jpg', 'Navy Boardroom Suit', 1),
  ('a1000008-0000-4000-8000-000000000002', 'c1000001-0000-4000-8000-000000000008', '/mock/product-08b.jpg', 'Navy boardroom suit styling', 2),
  ('a1000009-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000009', '/mock/product-09.jpg', 'Ivory Boardroom Gown', 1),
  ('a1000010-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000010', '/mock/product-10.jpg', 'Burgundy Executive Two-Piece', 1),
  ('a1000011-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000011', '/mock/product-11.jpg', 'Camel Tweed Suit', 1),
  ('a1000012-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000012', '/mock/product-12.jpg', 'High-Waist Power Suit', 1),
  ('a1000013-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000013', '/mock/product-13.jpg', 'Urban Blazer Dress', 1),
  ('a1000014-0000-4000-8000-000000000001', 'c1000001-0000-4000-8000-000000000014', '/mock/product-14.jpg', 'Draft Ivory Dinner Jacket', 1)
on conflict (id) do update set url = excluded.url, alt = excluded.alt;

