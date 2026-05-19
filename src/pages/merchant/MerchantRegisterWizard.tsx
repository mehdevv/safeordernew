/**
 * Marchand registration wizard, rendered in the `merchantPanel` slot of the
 * `AuthShell` (page unique formulaire + marque).
 * so navigating between Marchand login / signup / Client login / signup keeps
 * a single visual language.
 */
import { useState } from "react";
import { Link } from "wouter";
import { useRegisterMerchant } from "@workspace/api-client-react";
import { setToken } from "@/lib/auth";
import { activateMerchantAuth } from "@/lib/client-auth";
import { Field, SelectField, Spinner } from "@/pages/auth/AuthShell";
import { PWD_BAR_COLORS, strengthOf } from "@/pages/auth/auth-utils";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
];

const DELIVERY_COMPANIES = ["Yalidine", "ZR Express", "Maystro", "Procolis"] as const;

/** Textes maquette — étape Safe Standards (inscription marchand). */
const MERCHANT_SAFE_COMMIT_CONDITIONS = [
  {
    title: "Photos authentiques du produit",
    body:
      "Toutes les photos de vos produits doivent être des prises de vue réelles. Pas d'images Pinterest, pas de photos modifiées, pas de visuels recopiés. Chaque produit doit être photographié tel qu'il est.",
  },
  {
    title: "Description complète et honnête",
    body:
      "Chaque produit doit avoir une description détaillée : taille, couleur exacte, matière, dimensions, mode d'utilisation. Tout ce que le client ne peut pas voir sur la photo doit être écrit.",
  },
  {
    title: "Emballage soigné et protecteur",
    body:
      "Chaque commande doit être emballée de manière à protéger le produit durant le transport. Les produits fragiles doivent être sécurisés. Le client doit recevoir exactement ce qu'il a commandé.",
  },
] as const;

export default function MerchantRegisterWizard({
  onDone,
  loginHref = "/merchant/login",
}: {
  onDone: () => void;
  loginHref?: string;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const registerMutation = useRegisterMerchant();

  const [form, setForm] = useState({
    firstName: "Yacine",
    lastName: "Benali",
    email: "yacine@boutique.dz",
    phone1: "0550 000 000",
    phone2: "0770 000 000",
    password: "demo1234",
    shopName: "Boutique Yacine",
    wilaya: "Alger",
    commune: "Bab Ezzouar",
    address: "Rue, Cité, N° 12",
    deliveryCompanies: ["Yalidine"] as string[],
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  function toggleDeliveryCompany(name: string) {
    setForm(f => ({
      ...f,
      deliveryCompanies: f.deliveryCompanies.includes(name)
        ? f.deliveryCompanies.filter(c => c !== name)
        : [...f.deliveryCompanies, name],
    }));
  }

  const pwdScore = strengthOf(form.password);

  function validate(): string {
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) return "Veuillez renseigner votre nom complet.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email invalide.";
      if (form.password.length < 6) return "Mot de passe : au moins 6 caractères.";
      if (!/^0\d{9}$/.test(form.phone1.replace(/\s/g, ""))) return "Numéro de téléphone invalide (0XXXXXXXXX).";
      if (form.phone2.trim() && !/^0\d{9}$/.test(form.phone2.replace(/\s/g, "")))
        return "Téléphone 2 invalide (0XXXXXXXXX) ou laissez vide.";
    }
    if (step === 2) {
      if (!form.shopName.trim()) return "Veuillez indiquer le nom de la boutique.";
      if (!form.wilaya) return "Veuillez sélectionner une wilaya.";
      if (!form.commune.trim()) return "Veuillez indiquer la commune.";
      if (!form.address.trim()) return "Veuillez indiquer l'adresse.";
      if (form.deliveryCompanies.length === 0) return "Sélectionnez au moins une société de livraison.";
    }
    if (step === 3 && !accepted)
      return "Veuillez cocher la case pour accepter les 3 conditions Safe Standards.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
      return;
    }
    registerMutation.mutate(
      { data: { ...form } },
      {
        onSuccess: res => {
          setToken(res.token);
          activateMerchantAuth();
          onDone();
        },
        onError: () => setError("Impossible de créer le compte. Vérifiez vos informations."),
      },
    );
  }

  function goBack() {
    setError("");
    setStep(s => (s > 1 ? ((s - 1) as 1 | 2) : s));
  }

  return (
    <section className="reg-panel form-panel" aria-label="Inscription marchand" data-form="merchant">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">Créer votre compte boutique</h1>
        <p style={{ fontSize: 14, color: "var(--rb-ink-3)", margin: "-12px 0 14px" }}>
          Étape {step} sur 3 — vos infos, votre boutique, et les Safe Standards.
        </p>

        <div className="reg-step-dots" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
          {[1, 2, 3].map(s => (
            <span
              key={s}
              className={`reg-step-dot${s <= step ? " is-done" : ""}${s === step ? " is-active" : ""}`}
            />
          ))}
        </div>

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          {step === 1 && (
            <>
              <div className="reg-row">
                <Field label="Nom *" value={form.lastName} onChange={v => set("lastName", v)} required autoComplete="family-name" />
                <Field label="Prénom *" value={form.firstName} onChange={v => set("firstName", v)} required autoComplete="given-name" />
              </div>
              <Field
                label="Email *"
                type="email"
                value={form.email}
                onChange={v => set("email", v)}
                required
                autoComplete="email"
                placeholder="vous@boutique.dz"
              />
              <div className="reg-row">
                <Field
                  label="Téléphone 1 *"
                  type="tel"
                  value={form.phone1}
                  onChange={v => set("phone1", v)}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0550 000 000"
                />
                <Field
                  label="Téléphone 2 (opt.)"
                  type="tel"
                  value={form.phone2}
                  onChange={v => set("phone2", v)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0770 000 000"
                />
              </div>
              <Field
                label="Mot de passe *"
                pwdToggle
                value={form.password}
                onChange={v => set("password", v)}
                required
                autoComplete="new-password"
                placeholder="Au moins 6 caractères"
              />
              <div className="reg-pwd-strength">
                <div className="bar" style={{ width: `${pwdScore * 25}%`, background: PWD_BAR_COLORS[pwdScore] }} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="Nom de la boutique *"
                value={form.shopName}
                onChange={v => set("shopName", v)}
                required
                autoComplete="organization"
              />
              <div className="reg-row">
                <SelectField
                  label="Wilaya *"
                  value={form.wilaya}
                  onChange={v => set("wilaya", v)}
                  options={WILAYAS.map(w => ({ value: w, label: w }))}
                  required
                  placeholder="Sélectionner…"
                />
                <Field label="Commune *" value={form.commune} onChange={v => set("commune", v)} required />
              </div>
              <Field
                label="Adresse complète *"
                value={form.address}
                onChange={v => set("address", v)}
                required
                placeholder="Rue, Cité, N° …"
              />
              <div className="reg-delivery-section">
                <div className="reg-delivery-heading">Sociétés de livraison *</div>
                <div className="reg-delivery-grid">
                  {DELIVERY_COMPANIES.map(name => (
                    <label key={name} className="reg-delivery-tile reg-checkbox">
                      <input
                        type="checkbox"
                        checked={form.deliveryCompanies.includes(name)}
                        onChange={() => toggleDeliveryCompany(name)}
                      />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="reg-safe-order">
                <h2 className="reg-safe-order-title">Engagement Safe Order</h2>
                <p className="reg-safe-order-lead">
                  Pour bénéficier de la protection Safe Pay,
                  <br />
                  vous acceptez les 3 conditions suivantes :
                </p>
                <ol className="reg-safe-condition-list">
                  {MERCHANT_SAFE_COMMIT_CONDITIONS.map((c, i) => (
                    <li key={c.title} className="reg-safe-condition">
                      <span className="reg-safe-condition-badge" aria-hidden>
                        {i + 1}
                      </span>
                      <div>
                        <div className="reg-safe-condition-heading">{c.title}</div>
                        <p className="reg-safe-condition-text">{c.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <label className="reg-checkbox reg-checkbox--safe-commit">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  required
                />
<span>
                  {
                    "Je comprends et j'accepte les 3 conditions Safe Standards. Je m'engage à les respecter pour chaque commande."
                  }
                </span>
              </label>
            </>
          )}

          {error && <div className="reg-error">{error}</div>}

          <div className="reg-wizard-nav">
            {step > 1 ? (
              <button
                type="button"
                className="reg-btn-secondary"
                onClick={goBack}
                disabled={registerMutation.isPending}
              >
                ← Retour
              </button>
            ) : (
              <Link href={loginHref} className="reg-btn-secondary reg-btn-secondary--link">
                Déjà un compte ?
              </Link>
            )}
            <button
              type="submit"
              className={`reg-btn-primary${step === 3 ? " reg-btn-primary--safe-commit" : ""}`}
              disabled={registerMutation.isPending}
              style={{ flex: 1 }}
            >
              {registerMutation.isPending ? (
                <Spinner />
              ) : step < 3 ? (
                "Suivant →"
              ) : (
                "Accéder à mon espace e-commerçant ›"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
