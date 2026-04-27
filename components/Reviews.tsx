"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
};

export default function Reviews({ productId }: { productId: string }) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await supabase.from("reviews").upsert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment,
    });
    setComment("");
    setLoading(false);
    load();
  };

  return (
    <div className="mt-12">
      <h3 className="serif text-2xl mb-4">Avis clients</h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucun avis pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white border border-rosepastel-100 rounded-2xl p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? "fill-rosepastel-400 text-rosepastel-400" : "text-neutral-300"}`}
                  />
                ))}
                <span className="ml-2 text-xs text-neutral-500">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-neutral-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form onSubmit={submit} className="mt-6 bg-white border border-rosepastel-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Note :</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} étoiles`}>
                <Star className={`w-5 h-5 ${n <= rating ? "fill-rosepastel-400 text-rosepastel-400" : "text-neutral-300"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre avis..."
            className="input min-h-[80px]"
          />
          <button disabled={loading} className="btn-primary">
            {loading ? "Envoi..." : "Publier mon avis"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-neutral-500">
          Connectez-vous pour publier un avis.
        </p>
      )}
    </div>
  );
}
