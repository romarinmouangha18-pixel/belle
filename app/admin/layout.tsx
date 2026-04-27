import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin · Belle Cosmetics",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authorized, reason } = await requireAdmin();

  if (!authorized) {
    if (reason === "guest") redirect("/login?redirect=/admin");
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h1 className="serif text-3xl mb-3">Accès refusé</h1>
        <p className="text-neutral-500">
          Cette section est réservée aux administrateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rosepastel-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <AdminSidebar />
        <main className="bg-white border border-rosepastel-100 rounded-2xl p-6 lg:p-8 min-h-[60vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
