import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(quantity, unit_price, products(name))")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="serif text-3xl mb-6">Commandes</h1>

      <div className="overflow-x-auto border border-rosepastel-100 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-rosepastel-50/50 text-left">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o: any) => {
              const itemsCount = o.order_items?.reduce((s: number, it: any) => s + it.quantity, 0) ?? 0;
              const ship = o.shipping_address ?? {};
              return (
                <tr key={o.id} className="border-t border-rosepastel-100 align-top">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(o.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p>{ship.fullName ?? "—"}</p>
                    <p className="text-xs text-neutral-500">
                      {[ship.city, ship.country].filter(Boolean).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{itemsCount} article(s)</td>
                  <td className="px-4 py-3 text-right font-semibold">{Number(o.total_price).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={o.id} current={o.status} />
                  </td>
                </tr>
              );
            })}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
