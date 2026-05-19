/**
 * SafeOrder — auth layout: formulaire | panneau marque.
 * Barre du haut : marque statique + switch Marchand / Client (même mode connexion ou inscription).
 */
import { useLayoutEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import "@/styles/auth.css";
import { LanguageSwitch } from "@/components/LanguageSwitch";

export function LogoMark({ variant = "dark", size = 52 }: { variant?: "dark" | "light"; size?: number }) {
  return (
    <img
      src="/favicon.png"
      alt="SafeOrder"
      width={size}
      height={size}
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
        filter: variant === "light" ? "drop-shadow(0 4px 10px rgba(0,0,0,.35))" : "none",
      }}
    />
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  pwdToggle,
  autoFocus,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  maxLength?: number;
  placeholder?: string;
  pwdToggle?: boolean;
  autoFocus?: boolean;
}) {
  const { t } = useTranslation("auth");
  const [shown, setShown] = useState(false);
  const realType = pwdToggle ? (shown ? "text" : "password") : type;
  const pwdAria = shown ? t("field.hidePassword") : t("field.showPassword");
  return (
    <div className="reg-field">
      <label>{label}</label>
      <div className="reg-input-wrap">
        <input
          type={realType}
          value={value}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={e => onChange(e.target.value)}
        />
        {pwdToggle && (
          <button
            type="button"
            className="reg-input-icon"
            onClick={() => setShown(s => !s)}
            aria-label={pwdAria}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = "Choisir…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  const { t } = useTranslation("auth");
  const ph = placeholder === "Choisir…" ? t("field.selectPlaceholder") : placeholder;
  return (
    <div className="reg-field">
      <label>{label}</label>
      <div className="reg-input-wrap">
        <select value={value} required={required} onChange={e => onChange(e.target.value)}>
          <option value="">{ph}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg className="reg-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

export function Spinner() {
  return <span className="reg-btn-spinner" />;
}

export function BrandPanel() {
  const { t } = useTranslation("auth");
  return (
    <section className="reg-panel brand-panel" aria-label={t("shell.aboutBrand")}>
      <div className="reg-brand-bg">
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <div className="dot d1" />
        <div className="dot d2" />
        <div className="grid-bottom" />
      </div>

      <div className="reg-floating-card fc-1">
        <div className="pulse" />
        <div>
          <div className="title">{t("brandPanel.parcelTitle")}</div>
          <div className="sub">{t("brandPanel.parcelSub")}</div>
        </div>
      </div>
      <div className="reg-floating-card fc-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5dffb1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div>
          <div className="title">{t("brandPanel.returnTitle")}</div>
          <div className="sub">{t("brandPanel.returnSub")}</div>
        </div>
      </div>

      <div className="reg-brand-inner">
        <div className="reg-brand-logo">
          <LogoMark variant="light" />
          <div className="wordmark">
            Safe<span>-</span>Order
          </div>
        </div>

        <h2 className="reg-brand-title">
          {t("brandPanel.headline1")}
          <br />
          <em>{t("brandPanel.headline2")}</em> {t("brandPanel.headline3")}
          <br />
          {t("brandPanel.headline4")}
        </h2>
        <p className="reg-brand-slogan">{t("brandPanel.slogan")}</p>
      </div>
    </section>
  );
}

interface AuthShellProps {
  /** Rôle du formulaire affiché (le switch navigue vers l’autre espace en gardant connexion / inscription). */
  activeRole: "merchant" | "client";
  authMode: "login" | "register";
  children: ReactNode;
}

export default function AuthShell({ activeRole, authMode, children }: AuthShellProps) {
  const { t } = useTranslation("auth");
  const [ready, setReady] = useState(false);
  const [, navigate] = useLocation();
  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const merchantHref = authMode === "login" ? "/merchant/login" : "/merchant/register";
  const clientHref = "/client/login";
  const switchClass =
    activeRole === "merchant" ? "reg-switch is-merchant" : "reg-switch is-customer";

  return (
    <div className="reg-root" data-ready={ready ? "true" : "false"} data-layout="single">
      <div className="reg-topbar">
        <div className="reg-topbar-brand">
          <LogoMark size={28} />
          <span>SafeOrder</span>
        </div>
        <div className="reg-topbar-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="reg-topbar-lang-desktop">
            <LanguageSwitch variant="auth" />
          </div>
          <div className={switchClass} role="group" aria-label={t("shell.chooseSpace")}>
            <button
              type="button"
              className={activeRole === "merchant" ? "active" : undefined}
              onClick={() => activeRole !== "merchant" && navigate(merchantHref)}
            >
              {t("shell.merchant")}
            </button>
            <button
              type="button"
              className={activeRole === "client" ? "active" : undefined}
              onClick={() => activeRole !== "client" && navigate(clientHref)}
            >
              {t("shell.client")}
            </button>
          </div>
        </div>
      </div>

      <div className="reg-stage reg-stage--single">
        <div className="reg-rail reg-rail--single">
          {children}
          <BrandPanel />
        </div>
      </div>

      <div className="reg-lang-bubble" role="region" aria-label={t("shell.languageBubbleAria")}>
        <LanguageSwitch variant="auth" />
      </div>
    </div>
  );
}
