-- ===================================================================
-- Schéma Supabase pour Belle Cosmetics
-- À exécuter dans le SQL editor de Supabase
-- ===================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================ PROFILS ============================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profils visibles par leur propriétaire"
  on public.profiles for select using (auth.uid() = id);
create policy "Profil modifiable par son propriétaire"
  on public.profiles for update using (auth.uid() = id);
create policy "Profil insérable par son propriétaire"
  on public.profiles for insert with check (auth.uid() = id);

-- Trigger : créer un profil à chaque nouvel utilisateur
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', new.email),
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================ CATÉGORIES ============================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  image_url text
);
alter table public.categories enable row level security;
create policy "Catégories lisibles par tous" on public.categories for select using (true);

-- ============================ PRODUITS ============================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  ingredients text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  images text[] default '{}',
  category text,
  brand text,
  stock int default 0,
  rating numeric(2,1) default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Produits lisibles par tous" on public.products for select using (true);

create extension if not exists pg_trgm;
create index if not exists products_category_idx on public.products(category);
create index if not exists products_brand_idx on public.products(brand);
create index if not exists products_name_trgm on public.products using gin (name gin_trgm_ops);

-- ============================ COMMANDES ============================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  total_price numeric(10,2) not null,
  status text default 'pending', -- pending|paid|shipped|delivered|cancelled
  stripe_session_id text,
  shipping_address jsonb,
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Commandes visibles par l'utilisateur" on public.orders
  for select using (auth.uid() = user_id);
create policy "Commandes créables par l'utilisateur" on public.orders
  for insert with check (auth.uid() = user_id);

-- ============================ ITEMS DE COMMANDE ============================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "Items visibles via la commande de l'utilisateur" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Items insérables via la commande de l'utilisateur" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ============================ AVIS ============================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table public.reviews enable row level security;
create policy "Avis lisibles par tous" on public.reviews for select using (true);
create policy "Avis créables par l'utilisateur connecté" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "Avis modifiables par l'auteur" on public.reviews
  for update using (auth.uid() = user_id);
create policy "Avis supprimables par l'auteur" on public.reviews
  for delete using (auth.uid() = user_id);

-- ============================ WISHLIST ============================
create table if not exists public.wishlists (
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);
alter table public.wishlists enable row level security;
create policy "Wishlist privée" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================ DONNÉES DE DÉMO ============================
insert into public.categories (slug, name, image_url) values
  ('soins-visage', 'Soins visage', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'),
  ('maquillage', 'Maquillage', 'https://images.unsplash.com/photo-1522335789203-aaa2f6d3ef58?w=800'),
  ('cheveux', 'Cheveux', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'),
  ('parfums', 'Parfums', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800')
on conflict (slug) do nothing;

insert into public.products (name, slug, description, ingredients, price, image_url, category, brand, stock, rating, is_featured) values
  ('Sérum Éclat Vitamine C', 'serum-eclat-vitamine-c', 'Un sérum lumineux qui illumine et unifie le teint au quotidien.', 'Aqua, Ascorbic Acid, Glycerin, Hyaluronic Acid', 39.90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'soins-visage', 'Belle', 25, 4.8, true),
  ('Crème Hydratante Rose', 'creme-hydratante-rose', 'Hydratation 24h enrichie à l''eau de rose.', 'Aqua, Rosa Damascena, Shea Butter, Tocopherol', 28.50, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', 'soins-visage', 'Belle', 40, 4.6, true),
  ('Rouge à Lèvres Velours', 'rouge-a-levres-velours', 'Rouge à lèvres mat longue tenue, fini velours.', 'Caprylic Triglyceride, Mica, Iron Oxides', 19.90, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'maquillage', 'Lumière', 60, 4.5, true),
  ('Palette Yeux Nude', 'palette-yeux-nude', '12 teintes nude mates et satinées.', 'Talc, Mica, Magnesium Stearate', 34.00, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', 'maquillage', 'Lumière', 18, 4.7, true),
  ('Shampoing Réparateur', 'shampoing-reparateur', 'Shampoing nourrissant pour cheveux abîmés.', 'Aqua, Sodium Cocoyl Isethionate, Argan Oil', 14.90, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800', 'cheveux', 'Soie', 80, 4.4, false),
  ('Masque Capillaire Karité', 'masque-capillaire-karite', 'Masque ultra-nourrissant au beurre de karité.', 'Aqua, Butyrospermum Parkii, Cetyl Alcohol', 22.00, 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=800', 'cheveux', 'Soie', 35, 4.6, false),
  ('Eau de Parfum Jasmin', 'eau-de-parfum-jasmin', 'Une fragrance florale, élégante et envoûtante.', 'Alcohol Denat., Parfum, Aqua', 79.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800', 'parfums', 'Belle', 22, 4.9, true),
  ('Eau de Toilette Vanille', 'eau-de-toilette-vanille', 'Notes gourmandes de vanille et fève tonka.', 'Alcohol Denat., Parfum, Aqua', 49.00, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800', 'parfums', 'Belle', 30, 4.5, false)
on conflict (slug) do nothing;

-- ============================ STORAGE ============================
-- Créer un bucket public 'product-images' depuis l'UI Supabase, ou:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
