import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLoginMerchant } from "@workspace/api-client-react";
import { activateMerchantAuth } from "@/lib/client-auth";
import { setToken } from "@/lib/auth";
import AuthShell, { Field, Spinner } from "./AuthShell";

export default function MerchantLoginPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    activateMerchantAuth();
  }, []);

  return (
    <AuthShell activeRole="merchant" authMode="login">
      <MerchantLoginForm
        registerHref="/merchant/register"
        onSuccess={() => navigate("/merchant/dashboard")}
      />
    </AuthShell>
  );
}

const DEMO_MERCHANT_EMAIL = "yacine@boutique.dz";
const DEMO_MERCHANT_PASSWORD = "demo1234";
const DEMO_MERCHANT_PHONE1 = "0550 000 000";
const DEMO_MERCHANT_PHONE2 = "0770 000 000";

function MerchantLoginForm({ onSuccess, registerHref }: { onSuccess: () => void; registerHref: string }) {
  const [email, setEmail] = useState(DEMO_MERCHANT_EMAIL);
  const [password, setPassword] = useState(DEMO_MERCHANT_PASSWORD);
  const loginMutation = useLoginMerchant();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: res => {
          setToken(res.token);
          activateMerchantAuth();
          onSuccess();
        },
      },
    );
  };

  return (
    <section className="reg-panel form-panel" aria-label="Connexion marchand" data-form="merchant">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">Connexion à votre espace boutique</h1>
        <form className="reg-form" onSubmit={submit} noValidate>
          <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" placeholder="vous@boutique.dz" />
          <Field label="Mot de passe" pwdToggle value={password} onChange={setPassword} required autoComplete="current-password" />
          <button className="reg-btn-primary" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Spinner /> : "Se connecter"}
          </button>
        </form>

        <div className="reg-demo" aria-label="Compte démo marchand">
          <div className="reg-demo-title">
            <span>Compte démo</span>
            <span className="reg-demo-tag">MVP</span>
          </div>
          <p className="reg-demo-note">
            Identifiants alignés sur l’écran d’inscription (Yacine Benali, Alger / Bab Ezzouar).
          </p>
          <div className="reg-demo-grid">
            <div className="reg-demo-btn" style={{ cursor: "default", pointerEvents: "none" }}>
              <span className="reg-demo-creds">Email</span>
              <span>{DEMO_MERCHANT_EMAIL}</span>
            </div>
            <div className="reg-demo-btn" style={{ cursor: "default", pointerEvents: "none" }}>
              <span className="reg-demo-creds">Mot de passe</span>
              <span>{DEMO_MERCHANT_PASSWORD}</span>
            </div>
            <div className="reg-demo-btn" style={{ cursor: "default", pointerEvents: "none" }}>
              <span className="reg-demo-creds">Téléphone 1</span>
              <span>{DEMO_MERCHANT_PHONE1}</span>
            </div>
            <div className="reg-demo-btn" style={{ cursor: "default", pointerEvents: "none" }}>
              <span className="reg-demo-creds">Téléphone 2</span>
              <span>{DEMO_MERCHANT_PHONE2}</span>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--rb-ink-3)" }}>
          Pas encore de compte marchand ?{" "}
          <Link href={registerHref} className="reg-link-btn" style={{ marginTop: 0, display: "inline" }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  );
}
