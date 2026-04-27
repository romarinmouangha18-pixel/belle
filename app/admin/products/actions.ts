"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(s: string) {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(name);
  const imagesRaw = String(formData.get("images") ?? "").trim();
  const images = imagesRaw
    ? imagesRaw.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    ingredients: String(formData.get("ingredients") ?? "").trim() || null,
    price: Number(formData.get("price") ?? 0),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    images,
    category: String(formData.get("category") ?? "").trim() || null,
    brand: String(formData.get("brand") ?? "").trim() || null,
    stock: Number(formData.get("stock") ?? 0),
    rating: Number(formData.get("rating") ?? 0),
    is_featured: formData.get("is_featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const { authorized } = await requireAdmin();
  if (!authorized) throw new Error("Non autorisé");
  const payload = parsePayload(formData);
  if (!payload.name) throw new Error("Le nom est requis");

  const supabase = createClient();
  const { error } = await supabase.from("products").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const { authorized } = await requireAdmin();
  if (!authorized) throw new Error("Non autorisé");
  const payload = parsePayload(formData);

  const supabase = createClient();
  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${payload.slug}`);
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const { authorized } = await requireAdmin();
  if (!authorized) throw new Error("Non autorisé");

  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
