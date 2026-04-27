"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shipping: form }),
    });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else {
      alert(json.error ?? "Erreur de paiement");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-neutral-500">Votre panier est vide.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="serif text-4xl mb-8">Commande</h1>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 bg-white border border-rosepastel-100 rounded-2xl p-6">
        <input required className="input md:col-span-2" placeholder="Nom complet" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required className="input md:col-span-2" placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input required className="input" placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input required className="input" placeholder="Code postal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <input required className="input md:col-span-2" placeholder="Pays" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />

        <div className="md:col-span-2 mt-3 border-t border-rosepastel-100 pt-4">
          <div className="flex justify-between text-sm">
            <span>Total</span><span className="font-semibold text-rosepastel-700">{total.toFixed(2)} €</span>
          </div>
          <button disabled={loading} className="btn-primary w-full justify-center mt-4">
            {loading ? "Redirection..." : "Payer avec Stripe"}
          </button>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Paiement sécurisé par Stripe.
          </p>
        </div>
      </form>
    </div>
  );
}
