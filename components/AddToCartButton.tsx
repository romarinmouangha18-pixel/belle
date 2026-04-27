"use client";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);

  const onAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };

  return (
    <button onClick={onAdd} className="btn-primary w-full sm:w-auto">
      {done ? (
        <>
          <Check className="w-4 h-4 mr-2" /> Ajouté
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 mr-2" /> Ajouter au panier
        </>
      )}
    </button>
  );
}
