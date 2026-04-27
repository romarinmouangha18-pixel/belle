"use client";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/admin/products/actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const onClick = () => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    start(async () => {
      try {
        await deleteProduct(id);
        router.refresh();
      } catch (e: any) {
        alert(e.message ?? "Erreur");
      }
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      title="Supprimer"
      className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
