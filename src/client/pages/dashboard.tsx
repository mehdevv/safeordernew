import { Link, useLocation } from "wouter";
import { useMemo } from "react";
import { useGetClientMe, useGetClientOrders } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Package, LogOut, Store, Hash, ExternalLink } from "lucide-react";
import { activateMerchantAuth, clearClientToken } from "@/lib/client-auth";
import { ClientAuthGuard } from "@/client/components/client-auth-guard";
import { orderStatusBadgeClass } from "@/lib/order-status-styles";

const STATUS_LABEL: Record<string, string> = {
  confirmation: "Confirmation",
  preparation: "Préparation",
  dispatch: "Expédition",
  en_livraison: "En livraison",
  livre: "Livré",
  retour: "Retour",
};

export default function ClientDashboard() {
  const [, navigate] = useLocation();

  const { data: client, isLoading } = useGetClientMe();
  const phoneDigits = client?.phoneDigits?.replace(/\D/g, "") ?? "";
  const { data: orders, isLoading: ordersLoading } = useGetClientOrders(phoneDigits.length >= 9 ? phoneDigits : "");

  const uniqueShops = useMemo(() => {
    if (!orders?.length) return [];
    return Array.from(new Set(orders.map(o => o.shopName).filter(Boolean)));
  }, [orders]);

  function handleLogout() {
    clearClientToken();
    activateMerchantAuth();
    navigate("/client/login");
  }

  return (
    <ClientAuthGuard>
      {isLoading || !client ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </div>
      ) : (
        <div className="min-h-screen bg-background pb-12">
          <div className="bg-primary text-primary-foreground px-4 py-6">
            <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-lg">Mon espace client</p>
                <p className="text-primary-foreground/90 text-sm font-mono truncate">{client.phone}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground shrink-0 hover:bg-primary-foreground/20"
                onClick={handleLogout}
                aria-label="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
            <div className="bg-card rounded-xl border shadow-sm p-4 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">Compte lié à votre numéro</p>
                <p className="text-xs text-muted-foreground">
                  Commandes, boutiques et codes de suivi associés à ce téléphone uniquement.
                </p>
              </div>
            </div>

            {/* Boutiques */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Boutiques achetées
                </CardTitle>
                <CardDescription>Comptes marchands chez qui vous avez commandé</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : uniqueShops.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {uniqueShops.map(name => (
                      <li key={name}>
                        <Badge variant="secondary" className="font-medium">
                          {name}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune commande pour ce numéro.</p>
                )}
              </CardContent>
            </Card>

            {/* Codes de suivi */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Codes de suivi
                </CardTitle>
                <CardDescription>Tous vos colis SafeTrack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {ordersLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : orders?.length ? (
                  orders.map(o => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-mono font-semibold truncate">{o.trackingCode}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.product?.name ?? "Produit"}</p>
                      </div>
                      <Link href={`/track/${encodeURIComponent(o.trackingCode)}`}>
                        <Button variant="ghost" size="sm" className="shrink-0 gap-1 h-8 px-2">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Suivre
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun code pour l’instant.</p>
                )}
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Mes commandes
                </CardTitle>
                <CardDescription>Historique pour {client.phone}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ordersLoading ? (
                  <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : orders?.length ? (
                  orders.map(order => {
                    const statusClass = orderStatusBadgeClass(order.status);
                    return (
                      <div key={order.id} className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{order.product?.name ?? "Produit"}</p>
                            <p className="text-xs text-muted-foreground truncate">{order.shopName}</p>
                            <p className="font-mono text-xs text-muted-foreground mt-0.5">{order.trackingCode}</p>
                          </div>
                          <Badge className={`text-xs shrink-0 ${statusClass}`}>
                            {STATUS_LABEL[order.status] ?? order.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{new Date(order.createdAt).toLocaleDateString("fr-DZ")}</span>
                          <span className="font-semibold text-foreground">
                            {order.totalPrice.toLocaleString("fr-DZ")} DZD
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/track/${encodeURIComponent(order.trackingCode)}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Suivre
                            </Button>
                          </Link>
                          {order.status === "livre" && (
                            <Link href={`/client/feedback/${order.id}`}>
                              <Button size="sm" variant="secondary">
                                Avis
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune commande avec ce numéro.</p>
                )}
              </CardContent>
            </Card>

            <Link href="/track" className="block">
              <Button variant="outline" className="w-full">
                Suivre un autre colis (code)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </ClientAuthGuard>
  );
}
