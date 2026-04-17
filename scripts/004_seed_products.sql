-- Seed sample products for Hikaru Bouken store
insert into public.products (name, slug, description, brand, category, price, stock, image_url, tags)
values
  -- Hiking Shoes
  ('Trail Blazer Pro', 'trail-blazer-pro', 'Premium hiking boots with Gore-Tex waterproof membrane and Vibram outsole for exceptional grip on any terrain. Features reinforced toe cap and ankle support.', 'Hikaru', 'hiking-shoes', 189.99, 45, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', array['hiking', 'waterproof', 'premium']),
  ('Mountain Explorer', 'mountain-explorer', 'Lightweight trail running shoes perfect for fast-paced hikes. Breathable mesh upper with responsive cushioning.', 'Hikaru', 'hiking-shoes', 149.99, 60, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', array['trail', 'lightweight', 'running']),
  ('Summit Trekker', 'summit-trekker', 'All-terrain hiking boots designed for challenging mountain expeditions. Waterproof leather with thermal insulation.', 'NorthPeak', 'hiking-shoes', 229.99, 30, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800', array['mountain', 'insulated', 'expedition']),
  
  -- Sandals
  ('River Walker', 'river-walker', 'Amphibious sport sandals with quick-dry webbing and aggressive water-channeling lugs. Perfect for river crossings.', 'AquaTrail', 'sandals', 79.99, 80, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800', array['water', 'quick-dry', 'summer']),
  ('Canyon Cruiser', 'canyon-cruiser', 'Versatile outdoor sandals with adjustable straps and shock-absorbing midsole. Ideal for hot weather adventures.', 'Hikaru', 'sandals', 89.99, 55, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800', array['outdoor', 'comfortable', 'adjustable']),
  
  -- Backpacks
  ('Expedition 65L', 'expedition-65l', 'Professional expedition backpack with 65L capacity, adjustable torso length, and integrated rain cover. Features multiple compartments and hydration compatible.', 'Hikaru', 'backpacks', 299.99, 25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', array['expedition', 'large', 'professional']),
  ('Day Hiker 25L', 'day-hiker-25l', 'Compact daypack perfect for short hikes. Lightweight design with padded laptop sleeve and water bottle pockets.', 'Hikaru', 'backpacks', 89.99, 100, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800', array['daypack', 'lightweight', 'everyday']),
  ('Alpine Pro 45L', 'alpine-pro-45l', 'Technical alpine backpack designed for mountaineering. Ice axe loops, crampon attachment, and ski carry system.', 'NorthPeak', 'backpacks', 249.99, 35, 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?w=800', array['alpine', 'technical', 'mountaineering']),
  ('Urban Explorer', 'urban-explorer', 'Sleek urban backpack that transitions from city streets to mountain trails. Water-resistant fabric with modern design.', 'Hikaru', 'backpacks', 129.99, 70, 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800', array['urban', 'versatile', 'water-resistant']),
  
  -- Jackets
  ('Storm Shield Pro', 'storm-shield-pro', '3-layer waterproof shell jacket with fully taped seams and underarm vents. Packable design fits in its own pocket.', 'Hikaru', 'jackets', 349.99, 40, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', array['waterproof', 'packable', 'breathable']),
  ('Thermal Peak', 'thermal-peak', 'Insulated winter jacket with 800-fill down and DWR coating. Lightweight warmth for extreme conditions.', 'NorthPeak', 'jackets', 399.99, 20, 'https://images.unsplash.com/photo-1544923246-77307dd628b7?w=800', array['insulated', 'down', 'winter']),
  ('Wind Runner', 'wind-runner', 'Ultralight windbreaker with moisture-wicking lining. Perfect layering piece for unpredictable weather.', 'Hikaru', 'jackets', 149.99, 65, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', array['windbreaker', 'ultralight', 'layering']),
  ('Soft Shell Flex', 'soft-shell-flex', 'Stretchy soft shell jacket for high-output activities. Water-resistant with 4-way stretch fabric.', 'Hikaru', 'jackets', 199.99, 50, 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800', array['softshell', 'stretch', 'active']),
  
  -- Outdoor Equipment
  ('TrekLight Tent 2P', 'treklight-tent-2p', 'Ultralight 2-person tent weighing just 1.5kg. Freestanding design with excellent ventilation and weatherproof flysheet.', 'Hikaru', 'equipment', 449.99, 15, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', array['tent', 'ultralight', 'camping']),
  ('Summit Poles Carbon', 'summit-poles-carbon', 'Carbon fiber trekking poles with ergonomic cork grips. Adjustable length with quick-lock mechanism.', 'Hikaru', 'equipment', 129.99, 45, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', array['trekking', 'poles', 'carbon']),
  ('Hydro Flask 1L', 'hydro-flask-1l', 'Insulated stainless steel water bottle. Keeps drinks cold 24 hours or hot 12 hours. BPA-free.', 'AquaTrail', 'equipment', 44.99, 120, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', array['hydration', 'insulated', 'bottle']),
  ('HeadLamp Pro 500', 'headlamp-pro-500', '500 lumen rechargeable headlamp with red light mode. IPX7 waterproof rating and 40-hour runtime.', 'Hikaru', 'equipment', 69.99, 80, 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800', array['headlamp', 'rechargeable', 'waterproof']),
  ('Compass Navigator', 'compass-navigator', 'Professional-grade orienteering compass with clinometer and mirror sighting. Luminous bezel for night navigation.', 'NorthPeak', 'equipment', 39.99, 60, 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800', array['navigation', 'compass', 'orienteering'])
on conflict (slug) do nothing;
