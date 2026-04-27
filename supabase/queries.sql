-- ============================================================================
-- REQUÊTES SQL — Belle Cosmetics
-- À copier-coller dans le SQL Editor de Supabase selon vos besoins.
-- ============================================================================


-- ============================================================================
-- 1) RÔLE ADMIN
-- ============================================================================

-- 1.a) Ajouter une colonne `role` à la table profiles (si pas déjà fait)
alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'admin'));

-- 1.b) Promouvoir un utilisateur en admin (par email)
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'romarinmouangha25@gmail.com');

-- 1.c) Rétrograder un admin en utilisateur normal
update public.profiles
set role = 'user'
where id = (select id from auth.users where email = 'autre.email@exemple.com');

-- 1.d) Lister tous les admins
select p.id, u.email, p.full_name, p.role, u.created_at
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'admin';

-- 1.e) Helper : fonction `is_admin()` réutilisable dans les policies RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ============================================================================
-- 2) UTILISATEURS
-- ============================================================================

-- 2.a) Lister tous les utilisateurs avec leur profil
select u.id, u.email, u.created_at, p.full_name, p.role, p.avatar_url
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc;

-- 2.b) Détails complets d'un utilisateur (commandes, avis, wishlist)
select u.id, u.email, p.full_name, p.role,
  (select count(*) from public.orders o where o.user_id = u.id) as nb_commandes,
  (select coalesce(sum(o.total_price), 0) from public.orders o where o.user_id = u.id and o.status = 'paid') as total_depense,
  (select count(*) from public.reviews r where r.user_id = u.id) as nb_avis,
  (select count(*) from public.wishlists w where w.user_id = u.id) as nb_favoris
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'client@exemple.com';

-- 2.c) Supprimer un utilisateur (cascade : supprime aussi profil, commandes, avis…)
-- ATTENTION : action irréversible
delete from auth.users where email = 'a.supprimer@exemple.com';

-- 2.d) Top 10 des meilleurs clients (par chiffre d'affaires)
select u.email, p.full_name,
  count(o.id) as nb_commandes,
  sum(o.total_price) as total_eur
from public.orders o
join auth.users u on u.id = o.user_id
left join public.profiles p on p.id = u.id
where o.status = 'paid'
group by u.id, u.email, p.full_name
order by total_eur desc
limit 10;


-- ============================================================================
-- 3) PRODUITS — CRUD
-- ============================================================================

-- 3.a) Lister tous les produits
select id, name, slug, brand, category, price, stock, rating, is_featured, created_at
from public.products
order by created_at desc;

-- 3.b) Rechercher un produit (par nom, marque ou catégorie)
select * from public.products
where name ilike '%sérum%'
   or brand ilike '%belle%'
   or category = 'soins-visage';

-- 3.c) Ajouter un nouveau produit
insert into public.products
  (name, slug, description, ingredients, price, image_url, images, category, brand, stock, rating, is_featured)
values
  (
    'Crème Mains Karité',
    'creme-mains-karite',
    'Crème nourrissante au beurre de karité bio.',
    'Aqua, Butyrospermum Parkii, Glycerin, Tocopherol',
    14.90,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    array['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200'],
    'soins-visage',
    'Belle',
    50,
    4.5,
    false
  );

-- 3.d) Modifier un produit
update public.products
set price = 24.90,
    stock = 100,
    is_featured = true
where slug = 'creme-mains-karite';

-- 3.e) Mettre un produit en vedette / le retirer de la une
update public.products set is_featured = true  where slug = 'serum-eclat-vitamine-c';
update public.products set is_featured = false where slug = 'serum-eclat-vitamine-c';

-- 3.f) Mettre à jour le stock après une commande (soustraire les quantités)
update public.products p
set stock = p.stock - oi.quantity
from public.order_items oi
where oi.product_id = p.id
  and oi.order_id = '00000000-0000-0000-0000-000000000000'; -- remplacer par l'id de commande

-- 3.g) Supprimer un produit
delete from public.products where slug = 'creme-mains-karite';

-- 3.h) Produits en rupture de stock
select id, name, slug, stock
from public.products
where stock = 0
order by name;

-- 3.i) Produits faible stock (alerte)
select id, name, slug, stock
from public.products
where stock < 10
order by stock asc;

-- 3.j) Top 10 produits les plus vendus
select p.id, p.name, p.slug,
  sum(oi.quantity) as quantite_vendue,
  sum(oi.quantity * oi.unit_price) as ca_genere
from public.order_items oi
join public.products p on p.id = oi.product_id
join public.orders o on o.id = oi.order_id
where o.status = 'paid'
group by p.id, p.name, p.slug
order by quantite_vendue desc
limit 10;

-- 3.k) Recalculer la note moyenne (rating) à partir des avis
update public.products p
set rating = coalesce((
  select round(avg(r.rating)::numeric, 1)
  from public.reviews r
  where r.product_id = p.id
), 0);


-- ============================================================================
-- 4) RLS — Policies pour donner les droits aux ADMINS sur les produits
-- ============================================================================
-- Par défaut le schéma actuel autorise SELECT à tous, mais aucune écriture côté
-- client. Ajoutons des policies pour que les admins puissent INSERT/UPDATE/DELETE
-- via l'app (sinon vous devez passer par le SQL Editor ou la service role key).

-- Admins peuvent insérer des produits
drop policy if exists "Admins peuvent insérer des produits" on public.products;
create policy "Admins peuvent insérer des produits"
  on public.products for insert
  with check (public.is_admin());

-- Admins peuvent modifier les produits
drop policy if exists "Admins peuvent modifier les produits" on public.products;
create policy "Admins peuvent modifier les produits"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins peuvent supprimer les produits
drop policy if exists "Admins peuvent supprimer les produits" on public.products;
create policy "Admins peuvent supprimer les produits"
  on public.products for delete
  using (public.is_admin());

-- Idem pour les catégories
drop policy if exists "Admins gèrent les catégories" on public.categories;
create policy "Admins gèrent les catégories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins voient toutes les commandes (en plus des leurs)
drop policy if exists "Admins voient toutes les commandes" on public.orders;
create policy "Admins voient toutes les commandes"
  on public.orders for select
  using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "Admins modifient toutes les commandes" on public.orders;
create policy "Admins modifient toutes les commandes"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());


-- ============================================================================
-- 5) STATISTIQUES UTILES (dashboard admin)
-- ============================================================================

-- 5.a) Chiffre d'affaires total (commandes payées)
select coalesce(sum(total_price), 0) as ca_total_eur
from public.orders
where status = 'paid';

-- 5.b) Chiffre d'affaires des 30 derniers jours
select coalesce(sum(total_price), 0) as ca_30j
from public.orders
where status = 'paid'
  and created_at > now() - interval '30 days';

-- 5.c) Nombre de commandes par statut
select status, count(*) as nb
from public.orders
group by status
order by nb desc;

-- 5.d) Évolution du CA par mois (12 derniers mois)
select
  date_trunc('month', created_at) as mois,
  count(*) as nb_commandes,
  sum(total_price) as ca
from public.orders
where status = 'paid'
  and created_at > now() - interval '12 months'
group by mois
order by mois asc;

-- 5.e) Nombre d'inscriptions par jour (30 derniers jours)
select
  date(created_at) as jour,
  count(*) as nouveaux_utilisateurs
from auth.users
where created_at > now() - interval '30 days'
group by jour
order by jour desc;
