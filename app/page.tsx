import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductCard from "@/components/ProductCard";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { demoProducts } from "@/lib/demo-products";
import type { Product } from "@/types";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  let featured: Product[] = [];
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(8);
    featured = (data ?? []) as Product[];
  }
  if (featured.length === 0) {
    featured = demoProducts.filter((p) => p.is_featured).slice(0, 8);
  }

  return (
    <>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="serif text-3xl md:text-4xl">Produits populaires</h2>
          <Link href="/products" className="text-sm text-rosepastel-700 hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Categories />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Livraison offerte", d: "Dès 50 € d'achat partout en France." },
            { t: "Beauté responsable", d: "Formules clean et packaging recyclable." },
            { t: "Service client", d: "Une équipe à votre écoute 7j/7." },
          ].map((b) => (
            <div key={b.t} className="bg-white rounded-2xl p-6 border border-rosepastel-100">
              <h3 className="serif text-xl">{b.t}</h3>
              <p className="text-sm text-neutral-600 mt-2">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
