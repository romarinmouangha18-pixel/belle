import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { demoProducts } from "@/lib/demo-products";
import type { Product } from "@/types";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import Reviews from "@/components/Reviews";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let p: Product | null = null;
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();
    if (data) p = data as Product;
  }
  if (!p) {
    p = demoProducts.find((d) => d.slug === params.slug) ?? null;
  }
  if (!p) return notFound();
  const images = p.images && p.images.length > 0 ? p.images : p.image_url ? [p.image_url] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs text-neutral-500 mb-6">
        <Link href="/products" className="hover:underline">Boutique</Link>
        {" / "}
        <Link href={`/products?category=${p.category}`} className="hover:underline">{p.category}</Link>
      </nav>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square bg-rosepastel-50 rounded-3xl overflow-hidden">
            {images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={p.name} className="w-full h-full object-cover" />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-rosepastel-600">{p.brand}</p>
          <h1 className="serif text-4xl mt-2">{p.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-rosepastel-400 text-rosepastel-400" />
              {p.rating?.toFixed(1) ?? "—"}
            </span>
            <span className="text-sm text-neutral-500">· {p.stock} en stock</span>
          </div>
          <p className="text-3xl font-semibold text-rosepastel-700 mt-5">{p.price.toFixed(2)} €</p>
          <p className="text-neutral-700 mt-5 leading-relaxed">{p.description}</p>

          <div className="mt-7">
            <AddToCartButton product={p} />
          </div>

          {p.ingredients && (
            <details className="mt-8 border-t border-rosepastel-100 pt-4">
              <summary className="cursor-pointer text-sm font-medium">Ingrédients</summary>
              <p className="mt-2 text-sm text-neutral-600">{p.ingredients}</p>
            </details>
          )}
        </div>
      </div>

      <Reviews productId={p.id} />
    </div>
  );
}
