import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

/** L’inscription client n’existe plus : connexion par téléphone + OTP uniquement. */
export default function ClientRegisterPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation("auth");
  useEffect(() => {
    navigate("/client/login");
  }, [navigate]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <p className="text-sm text-muted-foreground animate-pulse">{t("clientRegisterRedirect")}</p>
    </div>
  );
}
