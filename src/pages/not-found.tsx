import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { PublicPageChrome } from "@/components/PublicPageChrome";

export default function NotFound() {
  const { t } = useTranslation("common");

  return (
    <PublicPageChrome>
      <div className="w-full flex items-center justify-center p-4 min-h-0 py-16">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-destructive shrink-0" />
              <h1 className="text-2xl font-bold text-foreground">{t("notFound.title")}</h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{t("notFound.body")}</p>
            <Button asChild className="mt-6 w-full" variant="secondary">
              <Link href="/">{t("notFound.backHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicPageChrome>
  );
}
