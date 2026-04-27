import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-rosepastel-100 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <div className="serif text-2xl text-rosepastel-700 font-semibold">Belle.</div>
          <p className="mt-3 text-neutral-600 max-w-sm">
            Cosmétiques élégants, naturels et sensoriels. Une beauté pensée pour vous.
          </p>
          <div className="flex gap-3 mt-4 text-neutral-500">
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-rosepastel-600" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-rosepastel-600" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-rosepastel-600" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Boutique</h4>
          <ul className="space-y-2 text-neutral-600">
            <li><Link href="/products?category=soins-visage">Soins visage</Link></li>
            <li><Link href="/products?category=maquillage">Maquillage</Link></li>
            <li><Link href="/products?category=cheveux">Cheveux</Link></li>
            <li><Link href="/products?category=parfums">Parfums</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Aide</h4>
          <ul className="space-y-2 text-neutral-600">
            <li><Link href="/account">Mon compte</Link></li>
            <li><Link href="/account/orders">Mes commandes</Link></li>
            <li><a href="#">Livraison & retours</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rosepastel-100 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Belle Cosmetics. Tous droits réservés.
      </div>
    </footer>
  );
}
