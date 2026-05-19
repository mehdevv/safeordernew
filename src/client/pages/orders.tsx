import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useGetClientOrders } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Search, Package, ArrowLeft, Star } from "lucide-react";
import { ClientAuthGuard } from "@/client/components/client-auth-guard";
import { getClientToken, parseClientPhoneFromStubToken } from "@/lib/client-auth";
import { orderStatusBadgeClass } from "@/lib/order-status-styles";

const STATUS_LABEL: Record<string, string> = {
  confirmation: "Confirmation",
  preparation: "Préparation",
  dispatch: "Expédition",
  en_livraison: "En livraison",
  livre: "Livré",
  retour: "Retour",
};

export default function ClientOrders() {
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const { data: orders, isLoading } = useGetClientOrders(searchPhone);

  useEffect(() => {
    const fromToken = parseClientPhoneFromStubToken(getClientToken());
    if (fromToken && fromToken.length >= 9) {
      setPhone(fromToken);
      setSearchPhone(fromToken);
      return;
    }
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchPhone(phone.trim().replace(/\s/g, ""));
  }

  return (
    <ClientAuthGuard>
      <div className="min-h-screen bg-background p-4 pb-12">
        <div className="max-w-lg mx-auto pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/client/dashboard" className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Retour au tableau de bord">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h1 className="text-xl font-extrabold">Mes Commandes</h1>
              <p className="text-xs text-muted-foreground">Retrouvez toutes vos commandes SafeOrder</p>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rechercher par téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06XXXXXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <Button type="submit" disabled={phone.trim().replace(/\s/g, "").length < 9}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          )}

          {searchPhone && !isLoading && orders?.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <Package className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-medium">Aucune commande trouvée</p>
              <p className="text-sm text-muted-foreground">Vérifiez votre numéro de téléphone</p>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{orders.length} commande{orders.length > 1 ? "s" : ""} trouvée{orders.length > 1 ? "s" : ""}</p>
              {orders.map(order => {
                const statusClass = orderStatusBadgeClass(order.status);
                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{order.product?.name ?? "Produit"}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.shopName}</p>
                          <p className="font-mono text-xs text-muted-foreground">{order.trackingCode}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("fr-DZ")} · {order.wilaya}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`text-xs whitespace-nowrap ${statusClass}`}>
                            {STATUS_LABEL[order.status] ?? order.status}
                          </Badge>
                          <p className="text-sm font-bold">{order.totalPrice.toLocaleString("fr-DZ")} DZD</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/track/${encodeURIComponent(order.trackingCode)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1">
                            <Search className="h-3.5 w-3.5" />
                            Suivre
                          </Button>
                        </Link>
                        {order.status === "livre" && (
                          <Link href={`/client/feedback/${order.id}`}>
                            <Button size="sm" variant="secondary" className="gap-1">
                              <Star className="h-3.5 w-3.5" />
                              Avis
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ClientAuthGuard>
  );
}
