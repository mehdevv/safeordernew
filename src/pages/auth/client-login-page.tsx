import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("auth");
  const { t: te } = useTranslation("errors");
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
        title: te("otpSentTitle"),
        description: te("otpSentDesc", { code: res.demoOtp }),
      });
    } catch {
      toast({ title: te("invalidPhoneTitle"), description: te("invalidPhoneDesc"), variant: "destructive" });
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
        title: te("loginRefusedTitle"),
        description: te("loginRefusedDesc"),
        variant: "destructive",
      });
    }
  };

  return (
    <section className="reg-panel form-panel" aria-label={t("clientLogin.aria")} data-form="customer">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">{t("clientLogin.title")}</h1>
        <p style={{ fontSize: 14, color: "var(--rb-ink-3)", margin: "-12px 0 20px" }}>{t("clientLogin.subtitle")}</p>
        <form className="reg-form" onSubmit={submit} noValidate>
          <Field
            label={t("clientLogin.phone")}
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
            {sendOtp.isPending ? <Spinner /> : otpSent ? t("clientLogin.resendSms") : t("clientLogin.sendSms")}
          </button>
          <Field
            label={t("clientLogin.otp")}
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
            {loginClient.isPending ? <Spinner /> : t("clientLogin.submit")}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--rb-ink-3)" }}>
          <Link href="/track" style={{ color: "var(--rb-blue-600)", fontWeight: 600 }}>
            {t("clientLogin.trackNoAccount")}
          </Link>
        </p>
      </div>
    </section>
  );
}
