import { Link, useLocation } from "wouter";
import { clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  BarChart2, 
  BrainCircuit, 
  User, 
  LogOut, 
  Menu 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export function MerchantLayout({ children }: MerchantLayoutProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    clearToken();
    setLocation("/merchant/login");
  };

  const navItems = [
    { href: "/merchant/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/merchant/orders", icon: Package, label: "Commandes" },
    { href: "/merchant/products", icon: Package, label: "Produits" },
    { href: "/merchant/stats", icon: BarChart2, label: "Statistiques" },
    { href: "/merchant/insights", icon: BrainCircuit, label: "Safe Insights" },
    { href: "/merchant/profile", icon: User, label: "Profil" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">SafeOrder</h2>
        <p className="text-sidebar-foreground/70 text-sm mt-1">Espace Marchand</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground text-sidebar-foreground/80"
              }`}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
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
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">SafeOrder</h1>
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

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 border-r border-sidebar-border">
        <div className="fixed w-64 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
