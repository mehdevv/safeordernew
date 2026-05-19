import { MerchantLayout } from "@/components/merchant/layout";
import { 
  useGetInsights,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BrainCircuit, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";

export default function MerchantInsights() {
  const { data: insights, isLoading } = useGetInsights();

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high': return <Badge className="bg-destructive hover:bg-destructive/90">Haute</Badge>;
      case 'medium': return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Moyenne</Badge>;
      case 'low': return <Badge variant="secondary">Basse</Badge>;
      default: return null;
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
            <h1 className="text-3xl font-bold tracking-tight">Safe Insights</h1>
            <p className="text-muted-foreground">Analyse IA de votre pipeline et recommandations d'optimisation</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-accent/20 shadow-sm">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Actions Recommandées
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
              ) : (
                <div className="space-y-4">
                  {insights?.improvements?.length ? insights.improvements.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-background border">
                      <div className="mt-0.5">{getPriorityBadge(item.priority)}</div>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">Aucune recommandation pour le moment.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-success/20 shadow-sm">
            <CardHeader className="bg-success/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Vos Points Forts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
              ) : (
                <div className="space-y-4">
                  {insights?.strengths?.length ? insights.strengths.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-background border border-success/10">
                      <div className="bg-success/20 p-1.5 rounded-full mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                      </div>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">Analyse en cours...</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyse IA des Retours</CardTitle>
            <CardDescription>
              Détection automatique des causes récurrentes de retours clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Cause déclarée</TableHead>
                  <TableHead>Suggestion IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">Chargement...</TableCell>
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
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Pas assez de données de retour pour l'analyse IA.</TableCell>
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
