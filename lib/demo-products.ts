import type { Product } from "@/types";

export const demoProducts: Product[] = [
  {
    id: "demo-1",
    slug: "serum-eclat-rose",
    name: "Sérum Éclat Rose",
    brand: "Belle Paris",
    category: "soins-visage",
    description:
      "Un sérum lumineux à la rose de Damas et à la vitamine C, qui ravive l'éclat naturel de la peau dès les premières applications.",
    ingredients: "Aqua, Rosa Damascena, Ascorbic Acid, Hyaluronic Acid, Glycerin, Tocopherol.",
    price: 48.0,
    stock: 24,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200",
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=1200",
    ],
    is_featured: true,
    rating: 4.8,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    slug: "creme-velours-nuit",
    name: "Crème Velours Nuit",
    brand: "Belle Paris",
    category: "soins-visage",
    description:
      "Une crème nourrissante au beurre de karité et à l'huile de jojoba, pensée pour régénérer la peau pendant le sommeil.",
    ingredients: "Aqua, Butyrospermum Parkii, Simmondsia Chinensis, Squalane, Niacinamide.",
    price: 62.0,
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200"],
    is_featured: true,
    rating: 4.6,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    slug: "rouge-a-levres-poudre",
    name: "Rouge à Lèvres Poudré",
    brand: "Maison Lila",
    category: "maquillage",
    description:
      "Un rouge à lèvres au fini mat poudré, ultra-confortable, qui sublime les lèvres d'une teinte rose nude moderne.",
    price: 28.0,
    stock: 56,
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=900",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200"],
    is_featured: true,
    rating: 4.7,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    slug: "palette-blush-glow",
    name: "Palette Blush Glow",
    brand: "Maison Lila",
    category: "maquillage",
    description:
      "Trois teintes de blush poudre satinées pour sculpter et illuminer le teint en un geste.",
    price: 36.0,
    stock: 32,
    image_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200"],
    is_featured: true,
    rating: 4.5,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-5",
    slug: "mascara-volume-soie",
    name: "Mascara Volume Soie",
    brand: "Maison Lila",
    category: "maquillage",
    description:
      "Cils intensifiés, regard sublimé. Une formule enrichie en kératine qui prend soin des cils.",
    price: 24.0,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=900",
    images: ["https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=1200"],
    is_featured: false,
    rating: 4.4,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-6",
    slug: "huile-precieuse-cheveux",
    name: "Huile Précieuse Cheveux",
    brand: "Belle Paris",
    category: "cheveux",
    description:
      "Un mélange d'huiles d'argan, de camélia et de figue de Barbarie pour des cheveux soyeux et lumineux.",
    ingredients: "Argania Spinosa Oil, Camellia Oleifera Oil, Opuntia Ficus-Indica Oil.",
    price: 39.0,
    stock: 22,
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200"],
    is_featured: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-7",
    slug: "shampoing-douceur-amande",
    name: "Shampoing Douceur Amande",
    brand: "Belle Paris",
    category: "cheveux",
    description:
      "Un shampoing crémeux et délicat à l'amande douce, pour des cheveux nourris et un parfum gourmand.",
    price: 18.0,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=900",
    images: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200"],
    is_featured: false,
    rating: 4.3,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-8",
    slug: "parfum-rose-the",
    name: "Eau de Parfum Rose & Thé",
    brand: "Atelier Belle",
    category: "parfums",
    description:
      "Une eau de parfum florale et boisée, signature de la maison : rose poudrée, thé vert et bois de cèdre.",
    price: 89.0,
    stock: 14,
    image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200"],
    is_featured: true,
    rating: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-9",
    slug: "parfum-vanille-musc",
    name: "Eau de Parfum Vanille & Musc",
    brand: "Atelier Belle",
    category: "parfums",
    description:
      "Sensuel et enveloppant, ce parfum mêle la vanille de Madagascar à un musc blanc lumineux.",
    price: 95.0,
    stock: 9,
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900",
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200"],
    is_featured: false,
    rating: 4.7,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-10",
    slug: "masque-argile-rose",
    name: "Masque Argile Rose",
    brand: "Belle Paris",
    category: "soins-visage",
    description:
      "Un masque purifiant à l'argile rose, doux pour les peaux sensibles, qui affine le grain de peau.",
    price: 22.0,
    stock: 48,
    image_url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=900",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=1200"],
    is_featured: false,
    rating: 4.5,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-11",
    slug: "fond-de-teint-glow",
    name: "Fond de Teint Glow",
    brand: "Maison Lila",
    category: "maquillage",
    description:
      "Une couvrance modulable et un fini lumineux naturel, enrichi en acide hyaluronique.",
    price: 42.0,
    stock: 28,
    image_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200"],
    is_featured: false,
    rating: 4.6,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-12",
    slug: "brume-corps-fleur-oranger",
    name: "Brume Corps Fleur d'Oranger",
    brand: "Atelier Belle",
    category: "parfums",
    description:
      "Une brume légère et fraîche à la fleur d'oranger, pour parfumer délicatement la peau et les cheveux.",
    price: 32.0,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900",
    images: ["https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200"],
    is_featured: false,
    rating: 4.4,
    created_at: new Date().toISOString(),
  },
];

export function filterDemoProducts(params: {
  category?: string;
  brand?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
  featuredOnly?: boolean;
}): Product[] {
  let list = [...demoProducts];
  if (params.featuredOnly) list = list.filter((p) => p.is_featured);
  if (params.category) list = list.filter((p) => p.category === params.category);
  if (params.brand) list = list.filter((p) => p.brand === params.brand);
  if (params.q) {
    const q = params.q.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (params.min) list = list.filter((p) => p.price >= Number(params.min));
  if (params.max) list = list.filter((p) => p.price <= Number(params.max));

  switch (params.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      // "new" = ordre original
      break;
  }
  return list;
}
