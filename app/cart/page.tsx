"use client";
import { useCart } from "@/hooks/useCart";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQuantity);
  const total = useCart((s) => s.total());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="serif text-4xl mb-8">Mon panier</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500">Votre panier est vide.</p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">Découvrir la boutique</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <ul className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-4 bg-white border border-rosepastel-100 rounded-2xl p-3">
                <div className="w-20 h-20 bg-rosepastel-50 rounded-xl overflow-hidden flex-shrink-0">
                  {it.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-rosepastel-700">{it.price.toFixed(2)} €</p>
                </div>
                <div className="flex items-center gap-1 border border-neutral-200 rounded-full">
                  <button onClick={() => setQty(it.id, it.quantity - 1)} className="p-2"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="px-2 text-sm">{it.quantity}</span>
                  <button onClick={() => setQty(it.id, it.quantity + 1)} className="p-2"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => remove(it.id)} aria-label="Supprimer" className="p-2 text-neutral-500 hover:text-rosepastel-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <aside className="bg-white border border-rosepastel-100 rounded-2xl p-6 h-fit">
            <h2 className="serif text-xl mb-4">Récapitulatif</h2>
            <div className="flex justify-between text-sm">
              <span>Sous-total</span><span>{total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Livraison</span><span>{total >= 50 ? "Gratuite" : "4,90 €"}</span>
            </div>
            <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-rosepastel-100">
              <span>Total</span>
              <span>{(total + (total >= 50 ? 0 : 4.9)).toFixed(2)} €</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full justify-center mt-5">Passer commande</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
