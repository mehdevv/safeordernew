import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
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
import { LanguageSwitch } from "@/components/LanguageSwitch";
import i18n from "@/i18n";

export default function ClientOrders() {
  const { t } = useTranslation("client");
  const { t: tc } = useTranslation("common");
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const dateLocale = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";

  const { data: orders, isLoading } = useGetClientOrders(searchPhone);

  useEffect(() => {
    const fromToken = parseClientPhoneFromStubToken(getClientToken());
    if (fromToken && fromToken.length >= 9) {
      setPhone(fromToken);
      setSearchPhone(fromToken);
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/client/dashboard" className="text-muted-foreground hover:text-foreground shrink-0" aria-label={t("orders.backDashAria")}>
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold truncate">{t("orders.title")}</h1>
                <p className="text-xs text-muted-foreground">{t("orders.subtitle")}</p>
              </div>
            </div>
            <LanguageSwitch />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("orders.searchTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="phone">{t("orders.phoneLabel")}</Label>
                  <div className="flex gap-2">
                    <Input id="phone" type="tel" placeholder="06XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
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
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}

          {searchPhone && !isLoading && orders?.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <Package className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-medium">{t("orders.emptySearchTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("orders.emptySearchDesc")}</p>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {orders.length === 1 ? t("orders.foundOne", { n: orders.length }) : t("orders.foundMany", { n: orders.length })}
              </p>
              {orders.map(order => {
                const statusClass = orderStatusBadgeClass(order.status);
                const statusLabel = tc(`orderStatus.${order.status}` as const);
                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{order.product?.name ?? tc("product")}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.shopName}</p>
                          <p className="font-mono text-xs text-muted-foreground">{order.trackingCode}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(dateLocale)} · {order.wilaya}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`text-xs whitespace-nowrap ${statusClass}`}>{statusLabel}</Badge>
                          <p className="text-sm font-bold">{order.totalPrice.toLocaleString("fr-DZ")} DZD</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/track/${encodeURIComponent(order.trackingCode)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1">
                            <Search className="h-3.5 w-3.5" />
                            {t("dashboard.track")}
                          </Button>
                        </Link>
                        {order.status === "livre" && (
                          <Link href={`/client/feedback/${order.id}`}>
                            <Button size="sm" variant="secondary" className="gap-1">
                              <Star className="h-3.5 w-3.5" />
                              {t("dashboard.review")}
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
