import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetInsights } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BrainCircuit, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";

export default function MerchantInsights() {
  const { t } = useTranslation("merchant");
  const { t: tc } = useTranslation("common");
  const { data: insights, isLoading } = useGetInsights();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive hover:bg-destructive/90">{t("insights.priorityHigh")}</Badge>;
      case "medium":
        return (
          <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">{t("insights.priorityMedium")}</Badge>
        );
      case "low":
        return <Badge variant="secondary">{t("insights.priorityLow")}</Badge>;
      default:
        return null;
    }
  };

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-xl">
            <BrainCircuit className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("insights.title")}</h1>
            <p className="text-muted-foreground">{t("insights.subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-accent/20 shadow-sm">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                {t("insights.actionsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {insights?.improvements?.length ? (
                    insights.improvements.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-background border">
                        <div className="mt-0.5">{getPriorityBadge(item.priority)}</div>
                        <p className="text-sm">{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("insights.emptyImprovements")}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-success/20 shadow-sm">
            <CardHeader className="bg-success/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                {t("insights.strengthsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {insights?.strengths?.length ? (
                    insights.strengths.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-background border border-success/10">
                        <div className="bg-success/20 p-1.5 rounded-full mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        </div>
                        <p className="text-sm">{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("insights.analyzing")}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("insights.returnAnalysisTitle")}</CardTitle>
            <CardDescription>{t("insights.returnAnalysisDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("insights.colTracking")}</TableHead>
                  <TableHead>{t("insights.colCause")}</TableHead>
                  <TableHead>{t("insights.colSuggestion")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      {tc("loading")}
                    </TableCell>
                  </TableRow>
                ) : insights?.returnAnalysis && insights.returnAnalysis.length > 0 ? (
                  insights.returnAnalysis.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{item.trackingCode}</TableCell>
                      <TableCell className="font-medium text-destructive">{item.cause}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item.aiSuggestion}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      {t("insights.emptyReturns")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  );
}
