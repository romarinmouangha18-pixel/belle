"use client";
import Link from "next/link";
import { Heart, Search, Shield, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/products", label: "Boutique" },
  { href: "/products?category=soins-visage", label: "Soins visage" },
  { href: "/products?category=maquillage", label: "Maquillage" },
  { href: "/products?category=cheveux", label: "Cheveux" },
  { href: "/products?category=parfums", label: "Parfums" },
];

export default function Navbar() {
  const count = useCart((s) => s.count());
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const loadProfile = async (uid: string | null) => {
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", uid).single();
      setIsAdmin(data?.role === "admin");
    };
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      loadProfile(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-rosepastel-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="serif text-2xl font-semibold tracking-tight text-rosepastel-700">
          Belle<span className="text-neutral-900">.</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-neutral-700 hover:text-rosepastel-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/products" aria-label="Recherche" className="p-2 rounded-full hover:bg-rosepastel-50">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/account/wishlist" aria-label="Favoris" className="hidden sm:inline-flex p-2 rounded-full hover:bg-rosepastel-50">
            <Heart className="w-5 h-5" />
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Administration"
              title="Administration"
              className="p-2 rounded-full hover:bg-rosepastel-50 text-rosepastel-700"
            >
              <Shield className="w-5 h-5" />
            </Link>
          )}
          <Link href={user ? "/account" : "/login"} aria-label="Compte" className="p-2 rounded-full hover:bg-rosepastel-50">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/cart" aria-label="Panier" className="relative p-2 rounded-full hover:bg-rosepastel-50">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosepastel-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
