import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { ShoppingBag, Heart, Star, Wallet, Shield } from "lucide-react";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  // Stats client
  const [ordersRes, wishlistRes, reviewsRes] = await Promise.all([
    supabase.from("orders").select("id, total_price, status, created_at").eq("user_id", user!.id),
    supabase.from("wishlists").select("product_id").eq("user_id", user!.id),
    supabase.from("reviews").select("id").eq("user_id", user!.id),
  ]);

  const orders = ordersRes.data ?? [];
  const totalSpent = orders
    .filter((o: any) => o.status === "paid")
    .reduce((s: number, o: any) => s + Number(o.total_price), 0);
  const lastOrders = [...orders]
    .sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 5);

  const isAdmin = profile?.role === "admin";

  const stats = [
    { icon: ShoppingBag, label: "Commandes", value: orders.length },
    { icon: Wallet, label: "Total dépensé", value: `${totalSpent.toFixed(2)} €` },
    { icon: Heart, label: "Favoris", value: wishlistRes.data?.length ?? 0 },
    { icon: Star, label: "Avis publiés", value: reviewsRes.data?.length ?? 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="serif text-4xl">Bonjour {profile?.full_name?.split(" ")[0] ?? ""} ✨</h1>
          <p className="text-neutral-500 mt-1">{user!.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Link href="/admin" className="btn-dark gap-2">
              <Shield className="w-4 h-4" /> Espace admin
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-rosepastel-100 rounded-2xl p-5">
            <s.icon className="w-5 h-5 text-rosepastel-600" />
            <p className="text-xs text-neutral-500 mt-3">{s.label}</p>
            <p className="serif text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Profil */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-rosepastel-100 rounded-2xl p-6 md:col-span-1">
          <h2 className="serif text-xl mb-4">Profil</h2>
          <p className="text-sm"><span className="text-neutral-500">Nom :</span> {profile?.full_name ?? "—"}</p>
          <p className="text-sm mt-1"><span className="text-neutral-500">Email :</span> {user!.email}</p>
          <p className="text-sm mt-1">
            <span className="text-neutral-500">Membre depuis :</span>{" "}
            {new Date(user!.created_at).toLocaleDateString("fr-FR")}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/account/orders" className="btn-outline justify-center">Mes commandes</Link>
            <Link href="/account/wishlist" className="btn-outline justify-center">Mes favoris</Link>
          </div>
        </div>

        {/* Dernières commandes */}
        <div className="bg-white border border-rosepastel-100 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="serif text-xl">Dernières commandes</h2>
            <Link href="/account/orders" className="text-sm text-rosepastel-700 hover:underline">
              Voir tout →
            </Link>
          </div>
          {lastOrders.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Aucune commande pour le moment.{" "}
              <Link href="/products" className="underline text-rosepastel-700">
                Découvrir la boutique
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-rosepastel-100">
              {lastOrders.map((o: any) => (
                <li key={o.id} className="py-3 flex items-center justify-between">
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
      </div>
    </div>
  );
}
