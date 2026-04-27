import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = createClient();

  // On lit profiles + on jointe sur les commandes
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, created_at")
    .order("created_at", { ascending: false });

  // Stats commandes par utilisateur
  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total_price, status");

  const stats = new Map<string, { count: number; total: number }>();
  (orders ?? []).forEach((o: any) => {
    if (!o.user_id) return;
    const cur = stats.get(o.user_id) ?? { count: 0, total: 0 };
    cur.count += 1;
    if (o.status === "paid") cur.total += Number(o.total_price);
    stats.set(o.user_id, cur);
  });

  return (
    <div>
      <h1 className="serif text-3xl mb-6">Utilisateurs</h1>

      <div className="overflow-x-auto border border-rosepastel-100 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-rosepastel-50/50 text-left">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3 text-right">Commandes</th>
              <th className="px-4 py-3 text-right">Total dépensé</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p: any) => {
              const s = stats.get(p.id) ?? { count: 0, total: 0 };
              return (
                <tr key={p.id} className="border-t border-rosepastel-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rosepastel-100 flex items-center justify-center text-xs font-medium text-rosepastel-700">
                        {(p.full_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{p.full_name ?? "—"}</p>
                        <p className="text-xs text-neutral-500 font-mono">{p.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.role === "admin"
                          ? "bg-rosepastel-200 text-rosepastel-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {p.role ?? "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">{s.count}</td>
                  <td className="px-4 py-3 text-right font-medium">{s.total.toFixed(2)} €</td>
                </tr>
              );
            })}
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-500 mt-4">
        💡 Pour promouvoir un utilisateur en admin, exécutez la requête correspondante dans le SQL Editor de Supabase
        (voir <code>supabase/queries.sql</code> section 1.b).
      </p>
    </div>
  );
}
