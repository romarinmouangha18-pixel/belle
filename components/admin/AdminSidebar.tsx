"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, Home } from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white border border-rosepastel-100 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wider text-rosepastel-600 mb-3 px-2">
          Administration
        </p>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                isActive(href, exact)
                  ? "bg-rosepastel-100 text-rosepastel-800 font-medium"
                  : "text-neutral-600 hover:bg-rosepastel-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-rosepastel-100 mt-3 pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 hover:bg-rosepastel-50"
          >
            <Home className="w-4 h-4" />
            Retour au site
          </Link>
        </div>
      </div>
    </aside>
  );
}
