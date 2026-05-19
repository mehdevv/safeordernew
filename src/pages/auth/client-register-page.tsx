import { useEffect } from "react";
import { useLocation } from "wouter";

/** L’inscription client n’existe plus : connexion par téléphone + OTP uniquement. */
export default function ClientRegisterPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/client/login");
  }, [navigate]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <p className="text-sm text-muted-foreground animate-pulse">Redirection vers la connexion…</p>
    </div>
  );
}
