import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Pill matches landing / auth top bars */
  variant?: "sidebar" | "pill";
};

export function LanguageSwitch({ className, variant = "pill" }: Props) {
  const { t } = useTranslation("common");
  const lng = i18n.language?.startsWith("ar") ? "ar" : "fr";

  const base =
    variant === "sidebar"
      ? "inline-flex rounded-md bg-sidebar-accent/30 p-0.5 ring-1 ring-sidebar-border"
      : "inline-flex rounded-full bg-black/10 p-1 ring-1 ring-sidebar-border/50 dark:bg-white/10";

  return (
    <div role="group" aria-label={t("language.chooseAria")} className={cn(base, className)}>
      <button
        type="button"
        aria-pressed={lng === "fr"}
        onClick={() => {
          void i18n.changeLanguage("fr");
        }}
        className={cn(
          "rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
          lng === "fr"
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
          "rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
          lng === "ar"
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          variant === "pill" && "min-w-[3.25rem]",
        )}
      >
        {t("language.arLabel")}
      </button>
    </div>
  );
}
