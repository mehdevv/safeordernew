import { Link } from "wouter";
import { LanguageSwitch } from "@/components/LanguageSwitch";

/**
 * Slim header for public pages (track, order, 404) with language toggle.
 */
export function PublicPageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="shrink-0 flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <Link href="/" className="text-sm font-semibold text-foreground hover:underline">
          SafeOrder
        </Link>
        <LanguageSwitch />
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
