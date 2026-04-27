import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();
  if (!product) return notFound();

  const action = updateProduct.bind(null, params.id);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:underline">
          ← Retour aux produits
        </Link>
        <h1 className="serif text-3xl mt-2">Modifier · {product.name}</h1>
      </div>
      <ProductForm product={product} action={action} submitLabel="Enregistrer les modifications" />
    </div>
  );
}
