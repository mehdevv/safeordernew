import { useEffect } from "react";
import { useLocation } from "wouter";
import { activateMerchantAuth } from "@/lib/client-auth";
import AuthShell from "./AuthShell";
import MerchantRegisterWizard from "@/pages/merchant/MerchantRegisterWizard";

export default function MerchantRegisterPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    activateMerchantAuth();
  }, []);

  return (
    <AuthShell activeRole="merchant" authMode="register">
      <MerchantRegisterWizard loginHref="/merchant/login" onDone={() => navigate("/merchant/dashboard")} />
    </AuthShell>
  );
}
