import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  BarChart2,
  BrainCircuit,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitch } from "@/components/LanguageSwitch";

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export function MerchantLayout({ children }: MerchantLayoutProps) {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation("merchant");

  const handleLogout = () => {
    clearToken();
    setLocation("/merchant/login");
  };

  const navItems = [
    { href: "/merchant/dashboard", icon: LayoutDashboard, labelKey: "layout.nav.dashboard" as const },
    { href: "/merchant/orders", icon: Package, labelKey: "layout.nav.orders" as const },
    { href: "/merchant/products", icon: Package, labelKey: "layout.nav.products" as const },
    { href: "/merchant/stats", icon: BarChart2, labelKey: "layout.nav.stats" as const },
    { href: "/merchant/insights", icon: BrainCircuit, labelKey: "layout.nav.insights" as const },
    { href: "/merchant/profile", icon: User, labelKey: "layout.nav.profile" as const },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">SafeOrder</h2>
            <p className="text-sidebar-foreground/70 text-sm mt-1">{t("layout.merchantSpace")}</p>
          </div>
          <LanguageSwitch variant="sidebar" className="shrink-0" />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(item => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground text-sidebar-foreground/80"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 me-3" />
          {t("layout.logout")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold shrink-0">SafeOrder</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitch variant="sidebar" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-sidebar border-r-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 border-r border-sidebar-border">
        <div className="fixed w-64 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
