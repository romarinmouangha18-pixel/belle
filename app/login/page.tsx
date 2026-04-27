"use client";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center text-neutral-500">
          Chargement...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";
  const supabase = createClient();

  const [step, setStep] = useState<"email" | "code">("email");
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
        shouldCreateUser: false,
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
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }

    // Si admin, redirection vers /admin
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

  const resend = async () => {
    setLoading(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setInfo("Nouveau code envoyé.");
  };

  const google = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="serif text-3xl mb-2 text-center">Connexion</h1>
      <p className="text-center text-sm text-neutral-500 mb-8">
        {step === "email"
          ? "Recevez un code à 6 chiffres par email."
          : "Saisissez le code reçu par email."}
      </p>

      {step === "email" ? (
        <form
          onSubmit={sendCode}
          className="bg-white border border-rosepastel-100 rounded-2xl p-6 space-y-3"
        >
          <input
            className="input"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading || !email} className="btn-primary w-full justify-center">
            {loading ? "Envoi..." : "Recevoir le code"}
          </button>
          <div className="text-center text-xs text-neutral-400">— ou —</div>
          <button type="button" onClick={google} className="btn-outline w-full justify-center">
            Continuer avec Google
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
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            disabled={loading || code.length !== 6}
            className="btn-primary w-full justify-center"
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
          <div className="flex justify-between text-xs text-neutral-500">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setErr(null);
                setInfo(null);
              }}
              className="hover:underline"
            >
              ← Changer d&apos;email
            </button>
            <button
              type="button"
              onClick={resend}
              disabled={loading}
              className="hover:underline disabled:opacity-50"
            >
              Renvoyer le code
            </button>
          </div>
        </form>
      )}

      <p className="text-sm text-center mt-4 text-neutral-600">
        Pas de compte ?{" "}
        <Link href="/signup" className="text-rosepastel-700 underline">
          Inscription
        </Link>
      </p>
    </div>
  );
}
