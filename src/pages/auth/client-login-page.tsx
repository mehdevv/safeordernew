import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLoginClient, useSendClientOtp } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { activateClientAuth, clearClientProfile, isClientAuthenticated, setClientToken } from "@/lib/client-auth";
import AuthShell, { Field, Spinner } from "./AuthShell";

export default function ClientLoginPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    activateClientAuth();
    if (isClientAuthenticated()) {
      navigate("/client/dashboard");
    }
  }, [navigate]);

  return (
    <AuthShell activeRole="client" authMode="login">
      <ClientLoginForm onSuccess={() => navigate("/client/dashboard")} />
    </AuthShell>
  );
}

function ClientLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const sendOtp = useSendClientOtp();
  const loginClient = useLoginClient();

  const digits = phone.replace(/\D/g, "");
  const canSendOtp = digits.length >= 9;
  const canSubmit = canSendOtp && /^\d{6}$/.test(otp.replace(/\s/g, ""));

  async function handleSendOtp(e: React.MouseEvent) {
    e.preventDefault();
    if (!canSendOtp) return;
    try {
      const res = await sendOtp.mutateAsync({ data: { phone } });
      setOtpSent(true);
      toast({
        title: "Code envoyé",
        description: `Un SMS a été simulé. Code démo : ${res.demoOtp}`,
      });
    } catch {
      toast({ title: "Erreur", description: "Numéro de téléphone invalide.", variant: "destructive" });
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const result = await loginClient.mutateAsync({ data: { phone, otp } });
      clearClientProfile();
      setClientToken(result.token);
      void qc.invalidateQueries({ queryKey: ["stub", "client", "me"] });
      void qc.invalidateQueries({ queryKey: ["stub", "client-orders"] });
      activateClientAuth();
      onSuccess();
    } catch {
      toast({
        title: "Connexion refusée",
        description: "Code OTP incorrect. Démo : 123456",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="reg-panel form-panel" aria-label="Connexion client" data-form="customer">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">Connexion avec votre téléphone</h1>
        <p style={{ fontSize: 14, color: "var(--rb-ink-3)", margin: "-12px 0 20px" }}>
          Entrez votre numéro et le code reçu par SMS. Aucune inscription nécessaire.
        </p>
        <form className="reg-form" onSubmit={submit} noValidate>
          <Field
            label="Numéro de téléphone"
            type="tel"
            value={phone}
            onChange={setPhone}
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="0X XX XX XX XX"
            autoFocus
          />
          <button
            type="button"
            className="reg-btn-secondary"
            style={{ width: "100%", marginTop: 4 }}
            disabled={!canSendOtp || sendOtp.isPending}
            onClick={handleSendOtp}
          >
            {sendOtp.isPending ? <Spinner /> : otpSent ? "Renvoyer le code" : "Recevoir le code par SMS"}
          </button>
          <Field
            label="Code OTP (6 chiffres)"
            type="text"
            value={otp}
            onChange={v => setOtp(v.replace(/\D/g, "").slice(0, 6))}
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            autoComplete="one-time-code"
          />
          <button className="reg-btn-primary" type="submit" disabled={!canSubmit || loginClient.isPending}>
            {loginClient.isPending ? <Spinner /> : "Se connecter"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--rb-ink-3)" }}>
          <Link href="/track" style={{ color: "var(--rb-blue-600)", fontWeight: 600 }}>
            Suivre une commande sans compte →
          </Link>
        </p>
      </div>
    </section>
  );
}
