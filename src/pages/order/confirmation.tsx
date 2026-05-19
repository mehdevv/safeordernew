import { Link, useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { useTrackOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ShieldCheck, Search, ArrowRight, FileDown } from "lucide-react";
import { PublicPageChrome } from "@/components/PublicPageChrome";
import i18n from "@/i18n";

type TrackOrderPayload = NonNullable<NonNullable<ReturnType<typeof useTrackOrder>["data"]>["order"]>;

function formatReceiptAmount(n: number): string {
  const loc = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";
  return `${new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(Math.round(n))} DA`;
}

function paymentMethodLabel(t: (k: string) => string, method: string | undefined): string {
  const m = method === "baridimob" ? "chargilypay" : method;
  switch (m) {
    case "cib":
      return t("public.payCib");
    case "dahabia":
      return t("public.payDahabia");
    case "chargilypay":
      return t("public.payChargily");
    default:
      return t("confirmation.receiptPayUnknown");
  }
}

function buildDepositReceiptText(order: TrackOrderPayload, t: (k: string, o?: Record<string, string>) => string): string {
  const docId = order.depositReceiptId ?? `RCP-${order.trackingCode}`;
  const loc = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-DZ";
  const when = new Date(order.createdAt).toLocaleString(loc);
  const client = `${order.clientFirstName ?? ""} ${order.clientLastName ?? ""}`.trim();
  const lines: string[] = [
    "SafeOrder — Safe Pay",
    "─────────────────────",
    `${t("confirmation.receiptDocNo")}: ${docId}`,
    `${t("confirmation.receiptTracking")}: ${order.trackingCode}`,
    `${t("confirmation.receiptDate")}: ${when}`,
    "",
    `${t("confirmation.receiptShop")}: ${order.shopName ?? "—"}`,
    `${t("confirmation.receiptClient")}: ${client || "—"}`,
    `${t("confirmation.receiptProduct")}: ${order.product?.name ?? "—"}`,
    "",
    `${t("confirmation.receiptOrderTotal")}: ${formatReceiptAmount(order.totalPrice)}`,
    `${t("confirmation.receiptDepositPaid")}: ${formatReceiptAmount(order.safePayDepositAmount)}`,
    `${t("confirmation.receiptBalance")}: ${formatReceiptAmount(order.balanceAtDelivery)}`,
    "",
    `${t("confirmation.receiptPaymentMethod")}: ${paymentMethodLabel((k) => t(k), order.paymentMethod)}`,
    "",
    t("confirmation.depositReceiptSubtitle"),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

function downloadDepositReceipt(order: TrackOrderPayload, t: (k: string, o?: Record<string, string>) => string) {
  const text = buildDepositReceiptText(order, t);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = order.trackingCode.replace(/[^\w-]+/g, "_");
  a.href = url;
  a.download = `SafeOrder-recu-depot-${safe}.txt`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function OrderConfirmation() {
  const { t } = useTranslation("order");
  const search = useSearch();
  const params = new URLSearchParams(search);
  const trackingCode = params.get("tracking") ?? "";
  const { data: trackData, isLoading } = useTrackOrder(trackingCode);
  const order = trackData?.order;

  return (
    <PublicPageChrome>
      <div className="flex items-center justify-center p-4 min-h-0 py-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-success/15 p-5 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold">{t("confirmation.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("confirmation.body")}</p>
          </div>

          {trackingCode && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 pb-6 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("confirmation.trackingLabel")}</p>
                <p className="text-2xl font-mono font-bold text-primary">{trackingCode}</p>
                <p className="text-xs text-muted-foreground">{t("confirmation.trackingHint")}</p>
              </CardContent>
            </Card>
          )}

          {trackingCode && isLoading && (
            <div className="space-y-2 text-start">
              <Skeleton className="h-5 w-40 mx-auto" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          )}

          {trackingCode && !isLoading && order && (
            <Card className="border-border text-start shadow-sm">
              <CardContent className="pt-5 pb-5 space-y-4">
                <div>
                  <p className="font-bold text-sm">{t("confirmation.depositReceiptTitle")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("confirmation.depositReceiptSubtitle")}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 px-3 py-3 text-sm space-y-2 font-mono tabular-nums">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground shrink-0">{t("confirmation.receiptDocNo")}</span>
                    <span className="text-end break-all">{order.depositReceiptId ?? `RCP-${order.trackingCode}`}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{t("confirmation.receiptShop")}</span>
                    <span className="text-end">{order.shopName}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{t("confirmation.receiptProduct")}</span>
                    <span className="text-end">{order.product?.name ?? "—"}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-border pt-2">
                    <span className="text-muted-foreground">{t("confirmation.receiptDepositPaid")}</span>
                    <span className="font-semibold text-primary">{formatReceiptAmount(order.safePayDepositAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">{t("confirmation.receiptPaymentMethod")}</span>
                    <span>{paymentMethodLabel((k) => t(k), order.paymentMethod)}</span>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full gap-2" onClick={() => downloadDepositReceipt(order, t)}>
                  <FileDown className="h-4 w-4" />
                  {t("confirmation.downloadReceipt")}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/50 rounded-xl p-4 text-start space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t("confirmation.protectedTitle")}
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ps-6 list-disc">
              <li>{t("confirmation.li1")}</li>
              <li>{t("confirmation.li2")}</li>
              <li>{t("confirmation.li3")}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            {trackingCode && (
              <Link href={`/track/${trackingCode}`}>
                <Button className="w-full gap-2">
                  <Search className="h-4 w-4" />
                  {t("confirmation.trackCta")}
                </Button>
              </Link>
            )}
            <Link href="/track">
              <Button variant="outline" className="w-full gap-2">
                {t("confirmation.safeTrack")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicPageChrome>
  );
}
