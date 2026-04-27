import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:underline">
          ← Retour aux produits
        </Link>
        <h1 className="serif text-3xl mt-2">Nouveau produit</h1>
      </div>
      <ProductForm action={createProduct} submitLabel="Créer le produit" />
    </div>
  );
}
