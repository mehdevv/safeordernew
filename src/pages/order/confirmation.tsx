import { Link, useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { PublicPageChrome } from "@/components/PublicPageChrome";

export default function OrderConfirmation() {
  const { t } = useTranslation("order");
  const search = useSearch();
  const params = new URLSearchParams(search);
  const trackingCode = params.get("tracking") ?? "";

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
