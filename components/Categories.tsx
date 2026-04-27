import Link from "next/link";

const cats = [
  { slug: "soins-visage", name: "Soins visage", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800" },
  { slug: "maquillage", name: "Maquillage", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800" },
  { slug: "cheveux", name: "Cheveux", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800" },
  { slug: "parfums", name: "Parfums", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="serif text-3xl md:text-4xl">Nos catégories</h2>
        <Link href="/products" className="text-sm text-rosepastel-700 hover:underline">Tout voir →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="serif text-xl">{c.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
