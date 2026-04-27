"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"email" | "code">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setInfo(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setInfo(`Un code à 6 chiffres a été envoyé à ${email}.`);
    setStep("code");
  };

  const verifyCode = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }
    // Mise à jour du nom dans le profil (au cas où le trigger n'a pas pris le full_name)
    const { data: { user } } = await supabase.auth.getUser();
    if (user && name) {
      await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    }
    setLoading(false);
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="serif text-3xl mb-2 text-center">Créer un compte</h1>
      <p className="text-center text-sm text-neutral-500 mb-8">
        {step === "email" ? "Bienvenue chez Belle." : "Saisissez le code reçu par email."}
      </p>

      {step === "email" ? (
        <form
          onSubmit={sendCode}
          className="bg-white border border-rosepastel-100 rounded-2xl p-6 space-y-3"
        >
          <input
            className="input"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Envoi..." : "Recevoir le code"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={verifyCode}
          className="bg-white border border-rosepastel-100 rounded-2xl p-6 space-y-3"
        >
          {info && (
            <p className="text-sm text-rosepastel-700 bg-rosepastel-50 rounded-xl px-3 py-2">
              {info}
            </p>
          )}
          <input
            className="input text-center text-2xl tracking-[0.5em] font-mono"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            disabled={loading || code.length < 6}
            className="btn-primary w-full justify-center"
          >
            {loading ? "Vérification..." : "Créer mon compte"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setErr(null);
              setInfo(null);
            }}
            className="text-xs text-neutral-500 hover:underline"
          >
            ← Modifier mes informations
          </button>
        </form>
      )}

      <p className="text-sm text-center mt-4 text-neutral-600">
        Déjà inscrite ?{" "}
        <Link href="/login" className="text-rosepastel-700 underline">
          Connexion
        </Link>
      </p>
    </div>
  );
}
