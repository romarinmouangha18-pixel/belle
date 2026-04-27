"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setMsg("Vérifiez votre email pour confirmer votre compte.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="serif text-3xl mb-2 text-center">Créer un compte</h1>
      <p className="text-center text-sm text-neutral-500 mb-8">Bienvenue chez Belle.</p>
      <form onSubmit={submit} className="bg-white border border-rosepastel-100 rounded-2xl p-6 space-y-3">
        <input className="input" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Mot de passe (min. 6 caractères)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Création..." : "S'inscrire"}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-neutral-600">
        Déjà inscrite ? <Link href="/login" className="text-rosepastel-700 underline">Connexion</Link>
      </p>
    </div>
  );
}
