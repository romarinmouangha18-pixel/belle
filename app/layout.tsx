import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Belle Cosmetics — L'élégance au naturel",
  description:
    "Boutique en ligne de cosmétiques : soins visage, maquillage, cheveux et parfums. Élégance, qualité et bien-être.",
  keywords: ["cosmétiques", "beauté", "soins", "maquillage", "parfum", "e-commerce"],
  openGraph: {
    title: "Belle Cosmetics",
    description: "L'élégance au naturel",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
