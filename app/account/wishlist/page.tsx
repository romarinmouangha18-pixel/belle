import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Product } from "@/types";

export default async function WishlistPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account/wishlist");

  const { data } = await supabase
    .from("wishlists")
    .select("product_id, products(*)")
    .eq("user_id", user.id);

  const products: Product[] =
    (data ?? [])
      .map((row: any) => row.products)
      .filter(Boolean) as Product[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="serif text-4xl mb-8">Mes favoris</h1>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 mb-4">Vous n&apos;avez pas encore de favoris.</p>
          <Link href="/products" className="btn-primary inline-flex">Découvrir la boutique</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
