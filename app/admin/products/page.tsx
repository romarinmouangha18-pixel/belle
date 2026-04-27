import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);
  const { data: products } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="serif text-3xl">Produits</h1>
        <Link href="/admin/products/new" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Rechercher par nom..."
          className="input max-w-sm"
        />
      </form>

      <div className="overflow-x-auto border border-rosepastel-100 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-rosepastel-50/50 text-left">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Vedette</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p: any) => (
              <tr key={p.id} className="border-t border-rosepastel-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-neutral-500">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.brand ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.category ?? "—"}</td>
                <td className="px-4 py-3 text-right">{Number(p.price).toFixed(2)} €</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.stock === 0
                        ? "bg-red-100 text-red-700"
                        : p.stock < 10
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {p.is_featured ? <Star className="w-4 h-4 mx-auto fill-rosepastel-400 text-rosepastel-400" /> : <span className="text-neutral-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-2 rounded-lg hover:bg-rosepastel-50"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-neutral-500">
                  Aucun produit. <Link href="/admin/products/new" className="underline text-rosepastel-700">Créer le premier</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
