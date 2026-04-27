export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ingredients?: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  category: string | null;
  brand: string | null;
  stock: number;
  rating: number;
  is_featured: boolean;
  created_at?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
};

export type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
};
