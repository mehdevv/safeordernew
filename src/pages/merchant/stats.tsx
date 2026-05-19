import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetPerformanceStats, useGetMerchantFeedbackReceived } from "@workspace/api-client-react";
import i18n from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Star } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

function pctPart(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export default function MerchantStats() {
  const { t } = useTranslation("merchant");
  const dateLocale = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-FR";
  const { data: stats, isLoading } = useGetPerformanceStats({ period: "30d" });
  const { data: feedbackList, isLoading: feedbackLoading } = useGetMerchantFeedbackReceived();

  const feedbackMetrics = useMemo(() => {
    const list = feedbackList ?? [];
    if (!list.length) return null;
    const n = list.length;
    const sumRating = list.reduce((a, f) => a + f.rating, 0);
    const avg = sumRating / n;
    const satPct = Math.round((avg / 5) * 100);
    const five = list.filter(f => f.rating === 5).length;
    const fourPlus = list.filter(f => f.rating >= 4).length;
    return {
      count: n,
      avg,
      satPct,
      fiveStarPct: pctPart(five, n),
      fourPlusPct: pctPart(fourPlus, n),
    };
  }, [feedbackList]);

  const deliveryVolumeTotal = useMemo(
    () => (stats?.deliveryRateByCompany ?? []).reduce((a, c) => a + c.total, 0),
    [stats?.deliveryRateByCompany],
  );

  const topProductsRevenueTotal = useMemo(
    () => (stats?.topProducts ?? []).reduce((a, p) => a + p.revenue, 0),
    [stats?.topProducts],
  );

  const feedbackSentimentFooter = useMemo(() => {
    const motifs = stats?.feedbackSentiment?.negativeMotifs;
    if (!motifs?.length) return "";
    return motifs
      .map(m => `${t(`stats.feedbackNegReason_${m.id}`)} (${m.count})`)
      .join(", ");
  }, [stats?.feedbackSentiment?.negativeMotifs, t]);

  const posPct = stats?.feedbackSentiment?.positivePct ?? 0;
  const negPct = stats?.feedbackSentiment?.negativePct ?? 0;
  const posFr = Math.max(posPct, 0);
  const negFr = Math.max(negPct, 0);
  const sumFr = posFr + negFr;
  const gridPos = sumFr > 0 ? posFr : 1;
  const gridNeg = sumFr > 0 ? negFr : 1;

  const weeklyRevenueInsight = useMemo(() => {
    const w = stats?.weeklyOrders ?? [];
    if (w.length < 2) return null;
    const first = w[0]?.revenue ?? 0;
    const last = w[w.length - 1]?.revenue ?? 0;
    const changePct = first === 0 ? (last > 0 ? 100 : 0) : Math.round(((last - first) / first) * 100);
    const totalRev = w.reduce((a, d) => a + (d.revenue ?? 0), 0);
    const totalOrders = w.reduce((a, d) => a + (d.orders ?? 0), 0);
    const lastDayOrders = w[w.length - 1]?.orders ?? 0;
    const lastDayOrdersPct = totalOrders > 0 ? pctPart(lastDayOrders, totalOrders) : 0;
    return { changePct, totalRev, totalOrders, lastDayOrdersPct };
  }, [stats?.weeklyOrders]);

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("stats.title")}</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.confirmationRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold" data-testid="text-confirmation-rate">
                  {stats?.confirmationRate ?? 0}%
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.deliveryRateGlobal")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-success" data-testid="text-delivery-rate">
                  {stats?.deliveryRate ?? 0}%
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.returnRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-destructive" data-testid="text-return-rate">
                  {stats?.returnRate ?? 0}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-feedback-sentiment">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t("stats.feedbackTotalTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : (
              <>
                <div
                  className="grid min-h-[5.5rem] gap-1 overflow-hidden rounded-xl"
                  style={{ gridTemplateColumns: `${gridPos}fr ${gridNeg}fr` }}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center px-2 py-3 text-center",
                      "bg-emerald-100 dark:bg-emerald-950/40",
                    )}
                  >
                    <span className="text-2xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                      {posPct}%
                    </span>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      {t("stats.feedbackPosLabel")}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center px-2 py-3 text-center",
                      "bg-rose-100 dark:bg-rose-950/40",
                    )}
                  >
                    <span className="text-2xl font-bold tabular-nums text-rose-900 dark:text-rose-100">
                      {negPct}%
                    </span>
                    <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                      {t("stats.feedbackNegLabel")}
                    </span>
                  </div>
                </div>
                {feedbackSentimentFooter ? (
                  <p className="text-sm text-muted-foreground">
                    {t("stats.feedbackNegMotifsLead")} {feedbackSentimentFooter}
                  </p>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-feedback-received">
          <CardHeader>
            <CardTitle>{t("stats.feedbackTitle")}</CardTitle>
            <CardDescription>{t("stats.feedbackDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (feedbackList?.length ?? 0) > 0 ? (
              <>
                {feedbackMetrics ? (
                  <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">{t("stats.satAvg")}</p>
                      <p className="text-2xl font-bold tabular-nums">{feedbackMetrics.satPct}%</p>
                      <p className="text-xs text-muted-foreground">
                        {feedbackMetrics.avg.toFixed(1)}
                        {t("stats.starsSuffix")}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">{t("stats.fiveStar")}</p>
                      <p className="text-2xl font-bold tabular-nums">{feedbackMetrics.fiveStarPct}%</p>
                      <p className="text-xs text-muted-foreground">{t("stats.fiveStarSub")}</p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">{t("stats.fourPlus")}</p>
                      <p className="text-2xl font-bold tabular-nums text-success">{feedbackMetrics.fourPlusPct}%</p>
                      <p className="text-xs text-muted-foreground">{t("stats.fourPlusSub")}</p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">{t("stats.volume")}</p>
                      <p className="text-2xl font-bold tabular-nums">{feedbackMetrics.count}</p>
                      <p className="text-xs text-muted-foreground">{t("stats.volumeSub")}</p>
                    </div>
                  </div>
                ) : null}
                <ul className="divide-y rounded-lg border bg-card">
                  {feedbackList!.map(f => {
                    const rowSatPct = Math.round((f.rating / 5) * 100);
                    return (
                      <li key={f.orderId} className="p-4 first:rounded-t-lg last:rounded-b-lg">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium">{f.clientDisplay}</p>
                        <p className="text-sm text-muted-foreground">
                          {f.trackingCode}
                          {f.productName ? ` · ${f.productName}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="text-sm font-semibold tabular-nums text-primary">{rowSatPct}%</span>
                        <div className="flex items-center gap-0.5" aria-label={t("stats.ratingAria", { n: f.rating })}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                s <= f.rating ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/25"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {f.comment ? (
                      <blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground italic">
                        {f.comment}
                      </blockquote>
                    ) : null}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {t("stats.receivedOn", {
                        date: new Date(f.submittedAt).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }),
                      })}
                    </p>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t("stats.noFeedback")}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>{t("stats.weeklyRevenueTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[340px] flex-col gap-2">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <>
                  {weeklyRevenueInsight ? (
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {t("stats.insightRevenueLine", {
                        ca: `${weeklyRevenueInsight.totalRev.toLocaleString("fr-DZ")} DZD`,
                        trend: `${weeklyRevenueInsight.changePct >= 0 ? "+" : ""}${weeklyRevenueInsight.changePct}%`,
                        orders: weeklyRevenueInsight.totalOrders,
                      })}
                    </p>
                  ) : null}
                  <div className="min-h-0 flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.weeklyOrders ?? []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                  </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>{t("stats.orderVolumeTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[340px] flex-col gap-2">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <>
                  {weeklyRevenueInsight ? (
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {t("stats.insightOrdersLine", {
                        total: weeklyRevenueInsight.totalOrders,
                        ordersWord:
                          weeklyRevenueInsight.totalOrders > 1
                            ? t("stats.ordersPluralShort")
                            : t("stats.ordersSingularShort"),
                        lastPct: weeklyRevenueInsight.lastDayOrdersPct,
                      })}
                    </p>
                  ) : null}
                  <div className="min-h-0 flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.weeklyOrders ?? []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: "8px" }} />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("stats.courierTitle")}</CardTitle>
              <CardDescription>{t("stats.courierDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(stats?.deliveryRateByCompany ?? []).map((company, i) => {
                    const volPct =
                      deliveryVolumeTotal > 0 ? pctPart(company.total, deliveryVolumeTotal) : 0;
                    return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between gap-2">
                          <span className="text-sm font-medium">{company.company}</span>
                          <span className="shrink-0 text-right text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{company.rate}%</span> {t("stats.deliveredLabel")}
                            <span className="text-muted-foreground/80">
                              {" · "}
                              {volPct}% {t("stats.volShareLabel")}
                            </span>
                            <span className="block text-xs">({company.total})</span>
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${company.rate > 80 ? "bg-success" : company.rate > 50 ? "bg-warning" : "bg-destructive"}`}
                            style={{ width: `${company.rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    );
                  })}
                  {!(stats?.deliveryRateByCompany?.length) && (
                    <p className="text-sm text-muted-foreground">{t("stats.insufficientData")}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("stats.topProductsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(stats?.topProducts ?? []).map((product, i) => {
                    const caPct =
                      topProductsRevenueTotal > 0 ? pctPart(product.revenue, topProductsRevenueTotal) : 0;
                    return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border bg-card p-3"
                      data-testid={`card-product-${i}`}
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("stats.salesLine", { sales: product.sales, caPct })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{product.revenue.toLocaleString("fr-DZ")} DZD</div>
                        <p className="text-xs text-muted-foreground">{t("stats.caPctLine", { pct: caPct })}</p>
                      </div>
                    </div>
                    );
                  })}
                  {!(stats?.topProducts?.length) && (
                    <p className="text-sm text-muted-foreground">{t("stats.noProducts")}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MerchantLayout>
  );
}
