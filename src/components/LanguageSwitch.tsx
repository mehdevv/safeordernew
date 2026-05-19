import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Pill matches landing / auth top bars; auth uses high-contrast colors on login/signup */
  variant?: "sidebar" | "pill" | "auth";
};

export function LanguageSwitch({ className, variant = "pill" }: Props) {
  const { t } = useTranslation("common");
  const lng = i18n.language?.startsWith("ar") ? "ar" : "fr";

  const base =
    variant === "sidebar"
      ? "inline-flex rounded-md bg-sidebar-accent/30 p-0.5 ring-1 ring-sidebar-border"
      : variant === "auth"
        ? "inline-flex rounded-full border border-slate-200/90 bg-white/95 p-1 shadow-md backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95"
        : "inline-flex rounded-full bg-black/10 p-1 ring-1 ring-sidebar-border/50 dark:bg-white/10";

  const activeClass =
    variant === "auth"
      ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
      : "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm";

  const inactiveClass =
    variant === "auth"
      ? "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  const touch =
    variant === "auth"
      ? "min-h-[44px] min-w-[3.25rem] px-3 py-2 text-sm sm:min-h-0 sm:px-2.5 sm:py-1.5 sm:text-xs"
      : "px-2.5 py-1.5 text-xs";

  return (
    <div role="group" aria-label={t("language.chooseAria")} className={cn(base, className)}>
      <button
        type="button"
        aria-pressed={lng === "fr"}
        onClick={() => {
          void i18n.changeLanguage("fr");
        }}
        className={cn(
          "rounded-full font-semibold transition-colors",
          touch,
          lng === "fr" ? activeClass : inactiveClass,
          variant === "pill" && "min-w-[3rem]",
        )}
      >
        {t("language.fr")}
      </button>
      <button
        type="button"
        aria-pressed={lng === "ar"}
        onClick={() => {
          void i18n.changeLanguage("ar");
        }}
        className={cn(
          "rounded-full font-semibold transition-colors",
          touch,
          lng === "ar" ? activeClass : inactiveClass,
          variant === "pill" && "min-w-[3.25rem]",
        )}
      >
        {t("language.arLabel")}
      </button>
    </div>
  );
}
