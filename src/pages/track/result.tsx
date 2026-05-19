import { useParams, Link } from "wouter";
import { useTrackOrder } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, CheckCircle2, Circle, ArrowLeft, Package, MapPin, Phone, Star } from "lucide-react";
import { orderStatusBadgeClass } from "@/lib/order-status-styles";

const STATUS_LABEL: Record<string, string> = {
  confirmation: "Confirmation",
  preparation: "Préparation",
  dispatch: "Expédition",
  en_livraison: "En livraison",
  livre: "Livré",
  retour: "Retour",
};

export default function SafeTrackResult() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";

  const { data, isLoading, error } = useTrackOrder(code);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex justify-center">
        <div className="w-full max-w-lg space-y-4 mt-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Code introuvable</h2>
          <p className="text-muted-foreground text-sm">
            Aucune commande trouvée pour le code <span className="font-mono font-bold">{code}</span>.
            Vérifiez votre code et réessayez.
          </p>
          <Link href="/track">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Réessayer
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { order, steps, estimatedDelivery } = data;
  const statusLabel = STATUS_LABEL[order.status] ?? order.status;
  const statusClass = orderStatusBadgeClass(order.status);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-5 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/track">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Suivi de commande</h1>
            <p className="text-xs text-muted-foreground font-mono">{order.trackingCode}</p>
          </div>
        </div>

        {/* Status card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">État actuel</CardTitle>
              <Badge className={`text-xs ${statusClass}`}>{statusLabel}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>{order.product?.name ?? "Produit"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{order.wilaya}, {order.commune}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.clientPhone}</span>
            </div>
            {estimatedDelivery && (
              <p className="text-xs text-muted-foreground pt-1">
                Livraison estimée : <strong>{new Date(estimatedDelivery).toLocaleDateString('fr-DZ')}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Timeline steps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historique de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.done
                      ? <CheckCircle2 className="h-5 w-5 text-success" />
                      : <Circle className="h-5 w-5 text-muted-foreground/40" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.timestamp).toLocaleString('fr-DZ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Feedback CTA if delivered */}
        {order.status === "livre" && (
          <Card className="border-success/30 bg-success/10">
            <CardContent className="pt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">Votre commande est livrée !</p>
                <p className="text-xs text-muted-foreground">Partagez votre expérience</p>
              </div>
              <Link href={`/client/feedback/${order.id}`}>
                <Button size="sm" className="gap-1">
                  <Star className="h-3.5 w-3.5" />
                  Avis
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
