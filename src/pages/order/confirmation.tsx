import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Search, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const trackingCode = params.get("tracking") ?? "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-success/15 p-5 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold">Commande confirmée !</h1>
          <p className="text-muted-foreground text-sm">
            Votre commande a été enregistrée avec succès. Gardez votre code de suivi pour suivre votre livraison.
          </p>
        </div>

        {trackingCode && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 pb-6 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Code de suivi</p>
              <p className="text-2xl font-mono font-bold text-primary">{trackingCode}</p>
              <p className="text-xs text-muted-foreground">Conservez ce code pour suivre votre commande</p>
            </CardContent>
          </Card>
        )}

        <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Protégé par SafeOrder
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
            <li>Safe Pay bloque votre paiement jusqu'à livraison confirmée</li>
            <li>Votre commande est suivie en temps réel</li>
            <li>Support en cas de litige avec le vendeur</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {trackingCode && (
            <Link href={`/track/${trackingCode}`}>
              <Button className="w-full gap-2">
                <Search className="h-4 w-4" />
                Suivre ma commande
              </Button>
            </Link>
          )}
          <Link href="/track">
            <Button variant="outline" className="w-full gap-2">
              SafeTrack
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
