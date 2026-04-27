"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-rosepastel-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-rosepastel-100" />
          )}
          {product.is_featured && (
            <span className="absolute top-3 left-3 bg-rosepastel-500 text-white text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">
              Coup de cœur
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500">{product.brand ?? ""}</p>
          <h3 className="mt-1 text-sm font-medium text-neutral-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-rosepastel-700 font-semibold">{product.price.toFixed(2)} €</span>
            <span className="flex items-center gap-1 text-xs text-neutral-600">
              <Star className="w-3.5 h-3.5 fill-rosepastel-400 text-rosepastel-400" />
              {product.rating?.toFixed(1) ?? "—"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
