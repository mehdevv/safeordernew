import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetDashboardStats, useGetDashboardPipeline, useGetRecentOrders } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Undo2, ShieldCheck, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { orderStatusBorderTopClass } from "@/lib/order-status-styles";
import { cn } from "@/lib/utils";

const RECENT_INSIGHT_TAGS = ["safe_pay", "call_required", "new_customer", "loyal", "high_risk"] as const;
type RecentInsightTag = (typeof RECENT_INSIGHT_TAGS)[number];

function isRecentInsightTag(x: string): x is RecentInsightTag {
  return (RECENT_INSIGHT_TAGS as readonly string[]).includes(x);
}

function recentInsightVisual(tag: RecentInsightTag) {
  const map: Record<RecentInsightTag, { dot: string; badge: string }> = {
    safe_pay: {
      dot: "bg-emerald-500",
      badge: "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    call_required: {
      dot: "bg-amber-400",
      badge: "bg-amber-400/20 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
    },
    new_customer: {
      dot: "bg-sky-500",
      badge: "bg-sky-500/15 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200",
    },
    loyal: {
      dot: "bg-violet-500",
      badge: "bg-violet-500/15 text-violet-900 dark:bg-violet-500/20 dark:text-violet-200",
    },
    high_risk: {
      dot: "bg-red-500",
      badge: "bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300",
    },
  };
  return map[tag];
}

const PIPELINE_IDS = ["confirmation", "preparation", "dispatch", "en_livraison", "livre", "retour"] as const;

export default function MerchantDashboard() {
  const { t, i18n } = useTranslation("merchant");
  const { t: tc } = useTranslation("common");
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: pipeline, isLoading: pipelineLoading } = useGetDashboardPipeline();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders();

  const pipelineCols = useMemo(
    () => PIPELINE_IDS.map(id => ({ id, label: tc(`orderStatus.${id}`) })),
    [tc],
  );

  function fmtSigned(n: number) {
    if (n === 0) return "0";
    return n > 0 ? `+${n}` : String(n);
  }

  const ordersDelta = stats?.ordersTodayDelta ?? 0;
  const trustDelta = stats?.trustScoreDeltaMonth ?? 0;
  const numLocale = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
              <Package className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {statsLoading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-orders-today">
                    {stats?.ordersToday ?? 0}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.todayLabel")}</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                    {t("dashboard.vsYesterday", { delta: fmtSigned(ordersDelta) })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
              <Truck className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {statsLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-in-delivery">
                    {stats?.inDeliveryCount ?? 0}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.inDelivery")}</p>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-500">
                    {t("dashboard.urgentInDelivery", { n: stats?.urgentInDelivery ?? 0 })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
              <Undo2 className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {statsLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-returns-count">
                    {stats?.returnsCount ?? 0}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.returns")}</p>
                  <p className="text-xs font-medium text-red-600 dark:text-red-500">{t("dashboard.returnsIaHint")}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {statsLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary" data-testid="text-trust-score">
                    {stats?.trustScore ?? 0}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.trustScore")}</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                    {t("dashboard.trustDeltaMonth", { delta: fmtSigned(trustDelta) })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {statsLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-revenue-month">
                    {(stats?.revenueMonth ?? 0).toLocaleString(numLocale)} {t("dashboard.revenueCurrency")}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.revenueMonth")}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">{t("dashboard.pipelineTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineCols.map(col => {
              const count = pipeline ? pipeline[col.id] : 0;
              const c = count ?? 0;
              return (
                <Card
                  key={col.id}
                  className={`shadow-sm border-t-4 ${orderStatusBorderTopClass(col.id)}`}
                  data-testid={`pipeline-col-${col.id}`}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                      <span className="truncate">{col.label}</span>
                      <Badge variant="secondary">{pipelineLoading ? "-" : c}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 min-h-[80px]">
                    {pipelineLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : (
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        {c === 1 ? t("dashboard.orderSingular", { n: c }) : t("dashboard.orderPlural", { n: c })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">{t("dashboard.recentTitle")}</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {ordersLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                ) : !recentOrders?.length ? (
                  <div className="p-8 text-center text-muted-foreground">{t("dashboard.noRecent")}</div>
                ) : (
                  recentOrders.map(order => {
                    const tag = isRecentInsightTag(order.insightTag) ? order.insightTag : "new_customer";
                    const vis = recentInsightVisual(tag);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50"
                        data-testid={`row-recent-order-${order.id}`}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", vis.dot)} aria-hidden />
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <p className="font-medium text-sm leading-tight">
                              {order.clientFirstName} {order.clientLastName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {order.wilaya}
                              {" · "}
                              #{order.id}
                              {" · "}
                              {t(`dashboard.recentInsight.line.${tag}`)}
                            </p>
                            <span
                              className={cn(
                                "inline-flex max-w-full shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                                vis.badge,
                              )}
                            >
                              {t(`dashboard.recentInsight.badge.${tag}`)}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 text-sm font-medium tabular-nums">
                          {order.totalPrice.toLocaleString(numLocale)} {t("dashboard.revenueCurrency")}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MerchantLayout>
  );
}
