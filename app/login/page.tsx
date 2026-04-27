"use client";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center text-neutral-500">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }
    // Si admin, on redirige vers /admin (sauf si un redirect explicite est demandé)
    let target = redirect;
    if (redirect === "/account" && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profile?.role === "admin") target = "/admin";
    }
    setLoading(false);
    router.push(target);
    router.refresh();
  };

  const google = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="serif text-3xl mb-2 text-center">Connexion</h1>
      <p className="text-center text-sm text-neutral-500 mb-8">Heureuse de vous revoir.</p>
      <form onSubmit={submit} className="bg-white border border-rosepastel-100 rounded-2xl p-6 space-y-3">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <div className="text-center text-xs text-neutral-400">— ou —</div>
        <button type="button" onClick={google} className="btn-outline w-full justify-center">
          Continuer avec Google
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-neutral-600">
        Pas de compte ? <Link href="/signup" className="text-rosepastel-700 underline">Inscription</Link>
      </p>
    </div>
  );
}
