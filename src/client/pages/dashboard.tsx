import { Link, useLocation } from "wouter";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetClientMe, useGetClientOrders, useGetClientWallet, useGetClientAnalytics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Package,
  LogOut,
  Store,
  Hash,
  ExternalLink,
  FlaskConical,
  Wallet,
  BarChart3,
  LayoutDashboard,
  ListOrdered,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { activateMerchantAuth, clearClientToken } from "@/lib/client-auth";
import { ClientAuthGuard } from "@/client/components/client-auth-guard";
import { orderStatusBadgeClass } from "@/lib/order-status-styles";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import i18n from "@/i18n";

/** Produit démo n°1 du stub marchand — pour tester le formulaire de commande public */
const DEMO_PRODUCT_FORM_ID = 1;
const DEMO_PRODUCT_PRICE = 12900;

function formatDzd(n: number): string {
  const loc = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";
  return `${new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(Math.round(n))} DZD`;
}

function spendTrendLabel(a: { spendLast30Days: number; spendPrevious30Days: number }): {
  key: "analyticsTrendUp" | "analyticsTrendDown" | "analyticsTrendFlat";
  pct: number;
} {
  const { spendLast30Days, spendPrevious30Days } = a;
  if (spendPrevious30Days <= 0 && spendLast30Days <= 0) return { key: "analyticsTrendFlat", pct: 0 };
  if (spendPrevious30Days <= 0) return { key: "analyticsTrendUp", pct: 100 };
  const raw = Math.round(((spendLast30Days - spendPrevious30Days) / spendPrevious30Days) * 100);
  if (raw > 3) return { key: "analyticsTrendUp", pct: raw };
  if (raw < -3) return { key: "analyticsTrendDown", pct: raw };
  return { key: "analyticsTrendFlat", pct: 0 };
}

export default function ClientDashboard() {
  const [, navigate] = useLocation();
  const { t } = useTranslation("client");
  const { t: tc } = useTranslation("common");
  const dateLocale = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";

  const { data: client, isLoading } = useGetClientMe();
  const phoneDigits = client?.phoneDigits?.replace(/\D/g, "") ?? "";
  const ordersQuery = useGetClientOrders(phoneDigits.length >= 9 ? phoneDigits : "");
  const walletQuery = useGetClientWallet(phoneDigits.length >= 9 ? phoneDigits : "");
  const analyticsQuery = useGetClientAnalytics(phoneDigits.length >= 9 ? phoneDigits : "");

  const orders = ordersQuery.data;
  const ordersLoading = ordersQuery.isLoading;
  const wallet = walletQuery.data;
  const walletLoading = walletQuery.isLoading;
  const analytics = analyticsQuery.data;
  const analyticsLoading = analyticsQuery.isLoading;

  const uniqueShops = useMemo(() => {
    if (!orders?.length) return [];
    return Array.from(new Set(orders.map(o => o.shopName).filter(Boolean)));
  }, [orders]);

  const maxBar = useMemo(() => {
    if (!analytics?.spendByMonth?.length) return 1;
    return Math.max(1, ...analytics.spendByMonth.map(b => b.amount));
  }, [analytics]);

  function handleLogout() {
    clearClientToken();
    activateMerchantAuth();
    navigate("/client/login");
  }

  const trend = analytics ? spendTrendLabel(analytics) : null;

  return (
    <ClientAuthGuard>
      {isLoading || !client ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">{t("guardLoading")}</div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background pb-16">
          <header className="border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70 sm:text-xs">{t("dashboard.title")}</p>
                <p className="mt-0.5 truncate text-lg font-bold tracking-tight sm:mt-1 sm:text-2xl">
                  {[client.firstName, client.lastName].filter(Boolean).join(" ").trim() || t("dashboard.title")}
                </p>
                <p className="mt-0.5 font-mono text-xs text-primary-foreground/90 sm:mt-1 sm:text-sm">{client.phone}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 lg:shrink-0">
                <nav className="-mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0" aria-label="Navigation client">
                  <Link href="/client/dashboard">
                    <Button size="sm" variant="secondary" className="shrink-0 gap-1.5 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25">
                      <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:inline">{t("dashboard.navDashboard")}</span>
                    </Button>
                  </Link>
                  <Link href="/client/orders">
                    <Button size="sm" variant="ghost" className="shrink-0 gap-1.5 text-primary-foreground hover:bg-primary-foreground/15">
                      <ListOrdered className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:inline">{t("dashboard.navOrders")}</span>
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button size="sm" variant="ghost" className="shrink-0 gap-1.5 text-primary-foreground hover:bg-primary-foreground/15">
                      <Search className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:inline">{t("dashboard.navTrack")}</span>
                    </Button>
                  </Link>
                </nav>
                <div className="flex items-center gap-2 border-t border-primary-foreground/15 pt-2 sm:border-t-0 sm:pt-0">
                  <LanguageSwitch />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={handleLogout}
                    aria-label={t("dashboard.logoutAria")}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {(walletLoading || analyticsLoading) && phoneDigits.length >= 9 ? (
              <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[4.5rem] rounded-xl sm:h-24" />
                ))}
              </div>
            ) : wallet && analytics && phoneDigits.length >= 9 ? (
              <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-primary/10 shadow-sm">
                  <CardContent className="flex items-center gap-2 pt-4 sm:gap-3 sm:pt-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{t("dashboard.statOrders")}</p>
                      <p className="text-xl font-bold tabular-nums sm:text-2xl">{analytics.ordersTotal}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hidden border-emerald-500/15 shadow-sm md:block">
                  <CardContent className="flex items-center gap-3 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.statDelivered")}</p>
                      <p className="text-2xl font-bold tabular-nums">{analytics.deliveredCount}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hidden border-amber-500/15 shadow-sm md:block">
                  <CardContent className="flex items-center gap-3 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.statSpend30d")}</p>
                      <p className="truncate text-lg font-bold tabular-nums">{formatDzd(analytics.spendLast30Days)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-violet-500/15 shadow-sm">
                  <CardContent className="flex items-center gap-2 pt-4 sm:gap-3 sm:pt-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 sm:h-11 sm:w-11 sm:rounded-xl">
                      <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{t("dashboard.statSafePayHeld")}</p>
                      <p className="truncate text-base font-bold tabular-nums sm:text-2xl">{formatDzd(wallet.safePayHeld)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {wallet && phoneDigits.length >= 9 ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5 text-xs sm:text-sm lg:hidden">
                <span className="font-medium text-foreground">{t("dashboard.walletCashback")}</span>
                <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{formatDzd(wallet.cashbackAvailable)}</span>
              </div>
            ) : null}

            <Link href="/track" className="mb-4 block lg:hidden">
              <Button type="button" className="w-full gap-2" size="lg">
                <Search className="h-4 w-4" />
                {t("dashboard.navTrack")}
              </Button>
            </Link>

            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
              <div className="space-y-6 lg:col-span-2">
                <section
                  className="rounded-xl border border-dashed border-amber-800/25 bg-amber-50/90 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-amber-500/30 dark:bg-amber-950/25"
                  aria-label={t("dashboard.productTestAria")}
                  data-testid="client-product-form-demo"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <FlaskConical className="h-5 w-5 shrink-0 text-amber-800 dark:text-amber-200" aria-hidden />
                      <h2 className="text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
                        {t("dashboard.productTestTitle")}
                      </h2>
                    </div>
                    <Badge className="hidden shrink-0 border-0 bg-amber-200/90 text-[10px] font-bold uppercase text-amber-900 sm:inline-flex dark:bg-amber-400/30 dark:text-amber-50">
                      {t("dashboard.productTestBadge")}
                    </Badge>
                  </div>
                  <p className="hidden text-xs leading-relaxed text-amber-950/80 sm:block dark:text-amber-100/80">{t("dashboard.productTestDesc")}</p>
                  <div className="mt-2 hidden grid-cols-2 gap-2 sm:mt-3 sm:grid sm:grid-cols-4">
                    <div className="rounded-lg border border-border/80 bg-card px-2 py-3 text-center shadow-sm">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.productTestLabelName")}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-primary">{t("dashboard.productTestValName")}</p>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-card px-2 py-3 text-center shadow-sm">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.productTestLabelPrice")}</p>
                      <p className="mt-1 text-sm font-semibold text-primary tabular-nums">
                        {DEMO_PRODUCT_PRICE.toLocaleString(dateLocale)} {t("dashboard.productTestCurrency")}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-card px-2 py-3 text-center shadow-sm">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.productTestLabelRef")}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-primary">{t("dashboard.productTestValRef")}</p>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-card px-2 py-3 text-center shadow-sm">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("dashboard.productTestLabelCategory")}</p>
                      <p className="mt-1 text-sm font-semibold text-primary">{t("dashboard.productTestValCategory")}</p>
                    </div>
                  </div>
                  <Link href={`/order/${DEMO_PRODUCT_FORM_ID}?demo=1`} className="mt-2 block sm:mt-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full border-amber-800/20 bg-amber-100/80 text-amber-950 hover:bg-amber-200/80 dark:border-amber-500/30 dark:bg-amber-900/40 dark:text-amber-50 dark:hover:bg-amber-900/60"
                    >
                      {t("dashboard.productTestCta")}
                    </Button>
                  </Link>
                </section>

                <div className="hidden rounded-xl border bg-card p-4 shadow-sm lg:flex lg:items-start lg:gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{t("dashboard.linkedTitle")}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t("dashboard.linkedDesc")}</p>
                  </div>
                </div>

                <div className="hidden gap-4 lg:grid lg:grid-cols-2">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        {t("dashboard.shopsTitle")}
                      </CardTitle>
                      <CardDescription>{t("dashboard.shopsDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : uniqueShops.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {uniqueShops.map(name => (
                            <li key={name as string}>
                              <Badge variant="secondary" className="font-medium">
                                {name}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("dashboard.noShops")}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {t("dashboard.codesTitle")}
                      </CardTitle>
                      <CardDescription>{t("dashboard.codesDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-64 overflow-y-auto">
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
                              <p className="text-xs text-muted-foreground truncate">{o.product?.name ?? tc("product")}</p>
                            </div>
                            <Link href={`/track/${encodeURIComponent(o.trackingCode)}`}>
                              <Button variant="ghost" size="sm" className="shrink-0 gap-1 h-8 px-2">
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t("dashboard.track")}
                              </Button>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("dashboard.noCodes")}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-1 pb-2 sm:space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Package className="h-4 w-4" />
                      {t("dashboard.ordersTitle")}
                    </CardTitle>
                    <CardDescription className="hidden sm:block">{t("dashboard.ordersDesc", { phone: client.phone })}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {ordersLoading ? (
                      <>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </>
                    ) : orders?.length ? (
                      <div className="grid gap-3 sm:grid-cols-1 xl:grid-cols-2">
                        {orders.map(order => {
                          const statusClass = orderStatusBadgeClass(order.status);
                          const statusLabel = tc(`orderStatus.${order.status}` as const);
                          return (
                            <div key={order.id} className="space-y-2 rounded-lg border bg-card/50 p-2.5 sm:p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold">{order.product?.name ?? tc("product")}</p>
                                  <p className="truncate text-xs text-muted-foreground">{order.shopName}</p>
                                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground sm:text-xs">{order.trackingCode}</p>
                                </div>
                                <Badge className={`shrink-0 text-[10px] sm:text-xs ${statusClass}`}>{statusLabel}</Badge>
                              </div>
                              <div className="flex justify-between text-[11px] text-muted-foreground sm:text-xs">
                                <span>{new Date(order.createdAt).toLocaleDateString(dateLocale)}</span>
                                <span className="font-semibold text-foreground">{order.totalPrice.toLocaleString("fr-DZ")} DZD</span>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/track/${encodeURIComponent(order.trackingCode)}`} className="min-w-0 flex-1">
                                  <Button variant="outline" size="sm" className="h-9 w-full text-xs sm:h-10 sm:text-sm">
                                    {t("dashboard.track")}
                                  </Button>
                                </Link>
                                {order.status === "livre" && (
                                  <Link href={`/client/feedback/${order.id}`} className="shrink-0">
                                    <Button size="sm" variant="secondary" className="h-9 text-xs sm:h-10 sm:text-sm">
                                      {t("dashboard.review")}
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("dashboard.noOrders")}</p>
                    )}
                  </CardContent>
                </Card>

                <Link href="/track" className="hidden lg:block">
                  <Button variant="outline" className="w-full">
                    {t("dashboard.trackOther")}
                  </Button>
                </Link>
              </div>

              <aside className="hidden space-y-6 lg:block lg:sticky lg:top-6 lg:self-start">
                <Card className="border-violet-500/20 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-600/90 to-primary/90 px-4 py-3 text-primary-foreground">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      <p className="font-bold text-sm">{t("dashboard.walletTitle")}</p>
                    </div>
                    <p className="mt-1 text-xs text-primary-foreground/85">{t("dashboard.walletSubtitle")}</p>
                  </div>
                  <CardContent className="space-y-4 pt-5">
                    {walletLoading ? (
                      <Skeleton className="h-32 w-full" />
                    ) : wallet ? (
                      <>
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="text-muted-foreground">{t("dashboard.walletHeld")}</span>
                          <span className="font-semibold tabular-nums">{formatDzd(wallet.safePayHeld)}</span>
                        </div>
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="text-muted-foreground">{t("dashboard.walletCod")}</span>
                          <span className="font-semibold tabular-nums">{formatDzd(wallet.pendingCodTotal)}</span>
                        </div>
                        <div className="flex justify-between gap-2 text-sm border-t pt-3">
                          <span className="text-muted-foreground">{t("dashboard.walletVolume")}</span>
                          <span className="font-medium tabular-nums text-muted-foreground">{formatDzd(wallet.lifetimeOrdersVolume)}</span>
                        </div>
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="text-muted-foreground">{t("dashboard.walletCashback")}</span>
                          <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{formatDzd(wallet.cashbackAvailable)}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground border-t pt-3">{t("dashboard.walletInfo")}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("dashboard.noOrders")}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t("dashboard.analyticsTitle")}
                    </CardTitle>
                    <CardDescription>{t("dashboard.analyticsSubtitle")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analyticsLoading ? (
                      <Skeleton className="h-40 w-full" />
                    ) : analytics ? (
                      <>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg border bg-muted/40 px-3 py-2">
                            <p className="text-[10px] font-medium uppercase text-muted-foreground">{t("dashboard.statDelivered")}</p>
                            <p className="text-lg font-bold tabular-nums">{analytics.deliveredCount}</p>
                          </div>
                          <div className="rounded-lg border bg-muted/40 px-3 py-2">
                            <p className="text-[10px] font-medium uppercase text-muted-foreground">{t("dashboard.analyticsActive")}</p>
                            <p className="text-lg font-bold tabular-nums">{analytics.activePipelineCount}</p>
                          </div>
                          <div className="rounded-lg border bg-muted/40 px-3 py-2 col-span-2">
                            <p className="text-[10px] font-medium uppercase text-muted-foreground">{t("dashboard.analyticsAvg")}</p>
                            <p className="text-lg font-bold tabular-nums">{formatDzd(analytics.averageOrderValue)}</p>
                          </div>
                        </div>
                        {trend && (
                          <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs">
                            {trend.key === "analyticsTrendUp" && <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />}
                            {trend.key === "analyticsTrendDown" && <TrendingDown className="h-4 w-4 text-amber-600 shrink-0" />}
                            {trend.key === "analyticsTrendFlat" && <Minus className="h-4 w-4 text-muted-foreground shrink-0" />}
                            <span className="text-muted-foreground leading-snug">
                              {trend.key === "analyticsTrendFlat"
                                ? t(`dashboard.${trend.key}`)
                                : t(`dashboard.${trend.key}`, {
                                    pct: trend.key === "analyticsTrendDown" ? Math.abs(trend.pct) : trend.pct,
                                  })}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("dashboard.analyticsBars")}</p>
                          <ul className="space-y-2">
                            {analytics.spendByMonth.map(bar => {
                              const label = new Date(bar.year, bar.month - 1, 1).toLocaleDateString(dateLocale, { month: "short", year: "2-digit" });
                              const pct = Math.round((bar.amount / maxBar) * 100);
                              return (
                                <li key={`${bar.year}-${bar.month}`} className="space-y-1">
                                  <div className="flex justify-between text-[11px] text-muted-foreground">
                                    <span className="capitalize">{label}</span>
                                    <span className="font-mono tabular-nums">{formatDzd(bar.amount)}</span>
                                  </div>
                                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className="h-full rounded-full bg-primary transition-all"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("dashboard.noOrders")}</p>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </main>
        </div>
      )}
    </ClientAuthGuard>
  );
}
