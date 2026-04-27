import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage({ searchParams }: { searchParams: { success?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="serif text-4xl mb-6">Mes commandes</h1>
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 mb-6">
          Merci pour votre commande ! Un email de confirmation va vous être envoyé.
        </div>
      )}
      {!orders || orders.length === 0 ? (
        <p className="text-neutral-500">Aucune commande pour le moment. <Link href="/products" className="underline text-rosepastel-700">Découvrir la boutique</Link></p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o: any) => (
            <li key={o.id} className="bg-white border border-rosepastel-100 rounded-2xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Commande #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-neutral-500">{new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${o.status === "paid" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
                    {o.status}
                  </span>
                  <p className="font-semibold mt-1">{Number(o.total_price).toFixed(2)} €</p>
                </div>
              </div>
              <ul className="mt-3 text-sm text-neutral-600 space-y-1">
                {o.order_items?.map((it: any) => (
                  <li key={it.id}>· {it.products?.name ?? "Produit"} × {it.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
