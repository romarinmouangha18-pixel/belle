import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Wallet, ShoppingBag, Users as UsersIcon, Package, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [productsRes, ordersRes, usersRes, lowStockRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id, total_price, status, created_at"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id, name, slug, stock").lt("stock", 10).order("stock", { ascending: true }).limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const paidOrders = orders.filter((o: any) => o.status === "paid");
  const ca = paidOrders.reduce((s: number, o: any) => s + Number(o.total_price), 0);
  const ca30j = paidOrders
    .filter((o: any) => +new Date(o.created_at) > Date.now() - 30 * 86400_000)
    .reduce((s: number, o: any) => s + Number(o.total_price), 0);

  const recentOrders = [...orders]
    .sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 8);

  const stats = [
    { label: "CA total", value: `${ca.toFixed(2)} €`, icon: Wallet, color: "text-green-600" },
    { label: "CA 30 jours", value: `${ca30j.toFixed(2)} €`, icon: Wallet, color: "text-rosepastel-700" },
    { label: "Commandes", value: orders.length, icon: ShoppingBag, color: "text-neutral-700" },
    { label: "Produits", value: productsRes.count ?? 0, icon: Package, color: "text-neutral-700" },
    { label: "Utilisateurs", value: usersRes.count ?? 0, icon: UsersIcon, color: "text-neutral-700" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="serif text-3xl">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-rosepastel-100 rounded-2xl p-4 bg-rosepastel-50/30">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <p className="text-xs text-neutral-500 mt-3">{s.label}</p>
            <p className="serif text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Dernières commandes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="serif text-xl">Dernières commandes</h2>
            <Link href="/admin/orders" className="text-sm text-rosepastel-700 hover:underline">
              Voir tout →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">Aucune commande.</p>
          ) : (
            <ul className="divide-y divide-rosepastel-100 border border-rosepastel-100 rounded-2xl">
              {recentOrders.map((o: any) => (
                <li key={o.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-medium">#{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        o.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {o.status}
                    </span>
                    <p className="text-sm font-semibold mt-1">
                      {Number(o.total_price).toFixed(2)} €
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stock faible */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="serif text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Stock faible
            </h2>
            <Link href="/admin/products" className="text-sm text-rosepastel-700 hover:underline">
              Gérer →
            </Link>
          </div>
          {!lowStockRes.data || lowStockRes.data.length === 0 ? (
            <p className="text-sm text-neutral-500">Tous les stocks sont OK ✨</p>
          ) : (
            <ul className="divide-y divide-rosepastel-100 border border-rosepastel-100 rounded-2xl">
              {lowStockRes.data.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between p-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-sm hover:underline">
                    {p.name}
                  </Link>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.stock} en stock
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
