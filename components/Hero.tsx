"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 500px at 80% 0%, #fbe9ec 0%, transparent 60%), radial-gradient(900px 500px at 0% 100%, #f4ede1 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-rosepastel-600">
            Nouvelle collection
          </span>
          <h1 className="serif text-5xl md:text-6xl mt-4 leading-[1.05] text-neutral-900">
            L&apos;élégance,<br />au naturel.
          </h1>
          <p className="mt-5 text-neutral-600 max-w-md">
            Découvrez notre sélection de cosmétiques pensés avec soin :
            soins visage, maquillage, cheveux et parfums.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/products" className="btn-primary">Découvrir la boutique</Link>
            <Link href="/products?featured=1" className="btn-outline">Coups de cœur</Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200"
            alt="Cosmétiques"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
