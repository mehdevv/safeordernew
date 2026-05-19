import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { activateClientAuth, isClientAuthenticated } from "@/lib/client-auth";

export function ClientAuthGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { t } = useTranslation("client");

  useEffect(() => {
    activateClientAuth();
    if (!isClientAuthenticated()) {
      navigate("/client/login");
    }
  }, [navigate]);

  if (!isClientAuthenticated()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t("guardLoading")}</div>
      </div>
    );
  }

  return <>{children}</>;
}
