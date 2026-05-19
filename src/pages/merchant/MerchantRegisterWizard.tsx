/**
 * Marchand registration wizard, rendered in the `merchantPanel` slot of the
 * `AuthShell` (page unique formulaire + marque).
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
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

const DELIVERY_COMPANIES = ["Yalidine", "ZR Express", "Maystro", "World Express"] as const;

export default function MerchantRegisterWizard({
  onDone,
  loginHref = "/merchant/login",
}: {
  onDone: () => void;
  loginHref?: string;
}) {
  const { t } = useTranslation("auth");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const registerMutation = useRegisterMerchant();

  const safeConditions = useMemo(
    () => [
      { title: t("merchantRegister.safe1Title"), body: t("merchantRegister.safe1Body") },
      { title: t("merchantRegister.safe2Title"), body: t("merchantRegister.safe2Body") },
      { title: t("merchantRegister.safe3Title"), body: t("merchantRegister.safe3Body") },
    ],
    [t],
  );

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
    deliveryOther: false,
    deliveryOtherName: "",
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
      if (!form.firstName.trim() || !form.lastName.trim()) return t("merchantRegister.errName");
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return t("merchantRegister.errEmail");
      if (form.password.length < 6) return t("merchantRegister.errPwd");
      if (!/^0\d{9}$/.test(form.phone1.replace(/\s/g, ""))) return t("merchantRegister.errPhone1");
      if (form.phone2.trim() && !/^0\d{9}$/.test(form.phone2.replace(/\s/g, "")))
        return t("merchantRegister.errPhone2");
    }
    if (step === 2) {
      if (!form.shopName.trim()) return t("merchantRegister.errShop");
      if (!form.wilaya) return t("merchantRegister.errWilaya");
      if (!form.commune.trim()) return t("merchantRegister.errCommune");
      if (!form.address.trim()) return t("merchantRegister.errAddress");
      const hasPreset = form.deliveryCompanies.length > 0;
      const otherName = form.deliveryOtherName.trim();
      if (form.deliveryOther && !otherName) return t("merchantRegister.errDeliveryOther");
      if (!hasPreset && !(form.deliveryOther && otherName)) return t("merchantRegister.errDelivery");
    }
    if (step === 3 && !accepted) return t("merchantRegister.errAccept");
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
    const { deliveryOther, deliveryOtherName, deliveryCompanies, ...merchantRest } = form;
    const mergedDelivery = [
      ...deliveryCompanies,
      ...(deliveryOther && deliveryOtherName.trim() ? [deliveryOtherName.trim()] : []),
    ];
    registerMutation.mutate(
      { data: { ...merchantRest, deliveryCompanies: mergedDelivery } },
      {
        onSuccess: res => {
          setToken(res.token);
          activateMerchantAuth();
          onDone();
        },
        onError: () => setError(t("merchantRegister.errRegister")),
      },
    );
  }

  function goBack() {
    setError("");
    setStep(s => (s > 1 ? ((s - 1) as 1 | 2) : s));
  }

  return (
    <section className="reg-panel form-panel" aria-label={t("merchantRegister.aria")} data-form="merchant">
      <div className="reg-form-inner">
        <h1 className="reg-form-title">{t("merchantRegister.title")}</h1>
        <p style={{ fontSize: 14, color: "var(--rb-ink-3)", margin: "-12px 0 14px" }}>
          {t("merchantRegister.stepLine", { step })}
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
                <Field label={t("merchantRegister.lastName")} value={form.lastName} onChange={v => set("lastName", v)} required autoComplete="family-name" />
                <Field label={t("merchantRegister.firstName")} value={form.firstName} onChange={v => set("firstName", v)} required autoComplete="given-name" />
              </div>
              <Field
                label={t("merchantRegister.email")}
                type="email"
                value={form.email}
                onChange={v => set("email", v)}
                required
                autoComplete="email"
                placeholder="vous@boutique.dz"
              />
              <div className="reg-row">
                <Field
                  label={t("merchantRegister.phone1")}
                  type="tel"
                  value={form.phone1}
                  onChange={v => set("phone1", v)}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0550 000 000"
                />
                <Field
                  label={t("merchantRegister.phone2")}
                  type="tel"
                  value={form.phone2}
                  onChange={v => set("phone2", v)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="0770 000 000"
                />
              </div>
              <Field
                label={t("merchantRegister.password")}
                pwdToggle
                value={form.password}
                onChange={v => set("password", v)}
                required
                autoComplete="new-password"
                placeholder={t("merchantRegister.pwdPlaceholder")}
              />
              <div className="reg-pwd-strength">
                <div className="bar" style={{ width: `${pwdScore * 25}%`, background: PWD_BAR_COLORS[pwdScore] }} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label={t("merchantRegister.shopName")}
                value={form.shopName}
                onChange={v => set("shopName", v)}
                required
                autoComplete="organization"
              />
              <div className="reg-row">
                <SelectField
                  label={t("merchantRegister.wilaya")}
                  value={form.wilaya}
                  onChange={v => set("wilaya", v)}
                  options={WILAYAS.map(w => ({ value: w, label: w }))}
                  required
                  placeholder={t("merchantRegister.wilayaPh")}
                />
                <Field label={t("merchantRegister.commune")} value={form.commune} onChange={v => set("commune", v)} required />
              </div>
              <Field
                label={t("merchantRegister.address")}
                value={form.address}
                onChange={v => set("address", v)}
                required
                placeholder={t("merchantRegister.addressPh")}
              />
              <div className="reg-delivery-section">
                <div className="reg-delivery-heading">{t("merchantRegister.deliveryHeading")}</div>
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
                  <label className="reg-delivery-tile reg-checkbox">
                    <input
                      type="checkbox"
                      checked={form.deliveryOther}
                      onChange={e => set("deliveryOther", e.target.checked)}
                    />
                    <span>{t("merchantRegister.deliveryOther")}</span>
                  </label>
                </div>
                {form.deliveryOther && (
                  <Field
                    label={t("merchantRegister.deliveryOtherLabel")}
                    value={form.deliveryOtherName}
                    onChange={v => set("deliveryOtherName", v)}
                    placeholder={t("merchantRegister.deliveryOtherPh")}
                    autoComplete="organization"
                  />
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="reg-safe-order">
                <h2 className="reg-safe-order-title">{t("merchantRegister.safeTitle")}</h2>
                <p className="reg-safe-order-lead">
                  {t("merchantRegister.safeLead")}
                  <br />
                  {t("merchantRegister.safeLead2")}
                </p>
                <ol className="reg-safe-condition-list">
                  {safeConditions.map((c, i) => (
                    <li key={i} className="reg-safe-condition">
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
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required />
                <span>{t("merchantRegister.safeCommit")}</span>
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
                {t("merchantRegister.back")}
              </button>
            ) : (
              <Link href={loginHref} className="reg-btn-secondary reg-btn-secondary--link">
                {t("merchantRegister.hasAccount")}
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
                t("merchantRegister.next")
              ) : (
                t("merchantRegister.finish")
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
