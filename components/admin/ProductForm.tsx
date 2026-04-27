"use client";
import { useState, useTransition } from "react";
import type { Product } from "@/types";

type Action = (formData: FormData) => Promise<void>;

export default function ProductForm({
  product,
  action,
  submitLabel = "Enregistrer",
}: {
  product?: Partial<Product>;
  action: Action;
  submitLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(fd);
      } catch (err: any) {
        setError(err.message ?? "Erreur");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="text-xs text-neutral-500">Nom *</label>
        <input name="name" defaultValue={product?.name ?? ""} required className="input" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Slug (URL)</label>
        <input name="slug" defaultValue={product?.slug ?? ""} placeholder="auto-généré si vide" className="input" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Marque</label>
        <input name="brand" defaultValue={product?.brand ?? ""} className="input" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Catégorie</label>
        <select name="category" defaultValue={product?.category ?? ""} className="input">
          <option value="">—</option>
          <option value="soins-visage">Soins visage</option>
          <option value="maquillage">Maquillage</option>
          <option value="cheveux">Cheveux</option>
          <option value="parfums">Parfums</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-neutral-500">Prix (€) *</label>
        <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} required className="input" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Stock</label>
        <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} className="input" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Note (0-5)</label>
        <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating ?? 0} className="input" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-neutral-500">Image principale (URL)</label>
        <input name="image_url" defaultValue={product?.image_url ?? ""} className="input" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-neutral-500">Images supplémentaires (1 par ligne)</label>
        <textarea
          name="images"
          defaultValue={(product?.images ?? []).join("\n")}
          rows={3}
          className="input min-h-[80px]"
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-neutral-500">Description</label>
        <textarea name="description" defaultValue={product?.description ?? ""} rows={4} className="input min-h-[100px]" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs text-neutral-500">Ingrédients (INCI)</label>
        <textarea name="ingredients" defaultValue={product?.ingredients ?? ""} rows={2} className="input min-h-[60px]" />
      </div>
      <label className="md:col-span-2 flex items-center gap-2 text-sm">
        <input name="is_featured" type="checkbox" defaultChecked={product?.is_featured ?? false} />
        Mettre en vedette (affiché en page d&apos;accueil)
      </label>

      {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}

      <div className="md:col-span-2 flex gap-3">
        <button disabled={pending} className="btn-primary">
          {pending ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
