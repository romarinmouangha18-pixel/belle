import ProductCard from "@/components/ProductCard";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { demoProducts, filterDemoProducts } from "@/lib/demo-products";
import type { Product } from "@/types";
import Link from "next/link";

export const revalidate = 30;

const categories = [
  { slug: "", label: "Tous" },
  { slug: "soins-visage", label: "Soins visage" },
  { slug: "maquillage", label: "Maquillage" },
  { slug: "cheveux", label: "Cheveux" },
  { slug: "parfums", label: "Parfums" },
];

type SP = {
  category?: string;
  q?: string;
  brand?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sort = searchParams.sort ?? "new";
  let products: Product[] = [];
  let brands: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from("products").select("*");
    if (searchParams.category) query = query.eq("category", searchParams.category);
    if (searchParams.brand) query = query.eq("brand", searchParams.brand);
    if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);
    if (searchParams.min) query = query.gte("price", Number(searchParams.min));
    if (searchParams.max) query = query.lte("price", Number(searchParams.max));
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    else if (sort === "price-desc") query = query.order("price", { ascending: false });
    else if (sort === "rating") query = query.order("rating", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    const { data } = await query;
    products = (data ?? []) as Product[];
    const { data: allBrands } = await supabase.from("products").select("brand");
    brands = Array.from(new Set((allBrands ?? []).map((b: any) => b.brand).filter(Boolean)));
  }

  // Fallback démo
  if (products.length === 0) {
    products = filterDemoProducts({ ...searchParams, sort });
    brands = Array.from(new Set(demoProducts.map((p) => p.brand).filter(Boolean) as string[]));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="serif text-4xl">Boutique</h1>

      <form className="mt-6 flex flex-wrap gap-3 items-center bg-white border border-rosepastel-100 rounded-2xl p-4">
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Rechercher un produit..."
          className="input flex-1 min-w-[200px]"
        />
        <select name="category" defaultValue={searchParams.category ?? ""} className="input max-w-[180px]">
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
        <select name="brand" defaultValue={searchParams.brand ?? ""} className="input max-w-[160px]">
          <option value="">Toutes marques</option>
          {brands.map((b) => (
            <option key={b} value={b as string}>{b as string}</option>
          ))}
        </select>
        <input name="min" type="number" placeholder="Min €" defaultValue={searchParams.min ?? ""} className="input max-w-[100px]" />
        <input name="max" type="number" placeholder="Max €" defaultValue={searchParams.max ?? ""} className="input max-w-[100px]" />
        <select name="sort" defaultValue={sort} className="input max-w-[180px]">
          <option value="new">Nouveautés</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleures notes</option>
        </select>
        <button className="btn-primary">Filtrer</button>
        <Link href="/products" className="text-sm text-neutral-500 hover:underline">Réinitialiser</Link>
      </form>

      <p className="text-sm text-neutral-500 mt-4">{products.length} produit(s)</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-20 text-neutral-500">Aucun produit trouvé.</div>
      )}
    </div>
  );
}
