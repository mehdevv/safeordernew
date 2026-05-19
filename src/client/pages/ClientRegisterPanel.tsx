import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegisterClient } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { activateClientAuth, isClientAuthenticated, setClientProfile, setClientToken } from "@/lib/client-auth";
import { Field, SelectField, Spinner } from "@/pages/auth/AuthShell";
import { PWD_BAR_COLORS, strengthOf } from "@/pages/auth/auth-utils";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
];

export default function ClientRegisterPanel({ loginHref = "/client/login" }: { loginHref?: string } = {}) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wilaya: "",
    password: "",
    confirmPassword: "",
  });
  const register = useRegisterClient();
  const pwdScore = strengthOf(form.password);

  useEffect(() => {
    activateClientAuth();
    if (isClientAuthenticated()) {
      navigate("/client/dashboard");
    }
  }, [navigate]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    try {
      const result = await register.mutateAsync({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          wilaya: form.wilaya || undefined,
          password: form.password,
        },
      });
      setClientToken(result.token);
      setClientProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        wilaya: form.wilaya || undefined,
        createdAt: new Date().toISOString(),
      });
      activateClientAuth();
      navigate("/client/dashboard");
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer le compte. L'email est peut-être déjà utilisé.", variant: "destructive" });
    }
  }

  return (
    <section className="reg-panel form-panel" aria-label="Inscription client" data-form="customer">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">Créer un compte client</h1>
        <p style={{ fontSize: 14, color: "var(--rb-ink-3)", margin: "-12px 0 20px" }}>Gérez vos commandes SafeOrder en toute sécurité.</p>
        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          <div className="reg-row">
            <Field label="Prénom *" value={form.firstName} onChange={v => set("firstName", v)} required autoComplete="given-name" />
            <Field label="Nom *" value={form.lastName} onChange={v => set("lastName", v)} required autoComplete="family-name" />
          </div>
          <Field label="Email *" type="email" value={form.email} onChange={v => set("email", v)} required autoComplete="email" />
          <Field label="Téléphone *" type="tel" value={form.phone} onChange={v => set("phone", v)} required autoComplete="tel" inputMode="tel" placeholder="06XXXXXXXX" />
          <SelectField
            label="Wilaya (optionnel)"
            value={form.wilaya}
            onChange={v => set("wilaya", v)}
            options={WILAYAS.map(w => ({ value: w, label: w }))}
            placeholder="Sélectionner…"
          />
          <Field label="Mot de passe *" pwdToggle value={form.password} onChange={v => set("password", v)} required autoComplete="new-password" placeholder="Au moins 6 caractères" />
          <div className="reg-pwd-strength">
            <div className="bar" style={{ width: `${pwdScore * 25}%`, background: PWD_BAR_COLORS[pwdScore] }} />
          </div>
          <Field label="Confirmer le mot de passe *" pwdToggle value={form.confirmPassword} onChange={v => set("confirmPassword", v)} required autoComplete="new-password" />
          <button className="reg-btn-primary" type="submit" disabled={register.isPending}>
            {register.isPending ? <Spinner /> : "Créer mon compte"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}>
          <Link href={loginHref} style={{ color: "var(--rb-blue-600)", fontWeight: 600 }}>
            Déjà un compte ? Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}
