import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useSubmitFeedback, useGetFeedbackByOrder } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClientAuthGuard } from "@/client/components/client-auth-guard";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hover || value) ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABEL = ["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"];

export default function ClientFeedback() {
  const params = useParams<{ orderId: string }>();
  const orderId = parseInt(params.orderId ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: existing } = useGetFeedbackByOrder(orderId);

  const submitFeedback = useSubmitFeedback();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    try {
      await submitFeedback.mutateAsync({
        data: {
          orderId,
          rating,
          comment: comment.trim() || undefined,
        },
      });
      setSubmitted(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer votre avis. Réessayez.", variant: "destructive" });
    }
  }

  if (submitted || existing) {
    const displayRating = submitted ? rating : existing?.rating;
    const displayComment = submitted ? comment : existing?.comment;
    return (
      <ClientAuthGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="flex justify-center">
            <div className="bg-success/15 p-4 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Merci pour votre avis !</h2>
            <p className="text-sm text-muted-foreground mt-1">Votre retour aide à améliorer le service.</p>
          </div>
          {displayRating && (
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`h-6 w-6 ${s <= displayRating ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/30"}`} />
              ))}
            </div>
          )}
          {displayComment && (
            <Card className="text-left">
              <CardContent className="pt-4 text-sm text-muted-foreground italic">"{displayComment}"</CardContent>
            </Card>
          )}
          <Button variant="outline" className="w-full" onClick={() => navigate("/track")}>
            Suivre d'autres commandes
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" asChild>
            <Link href="/client/dashboard">Retour à mon espace</Link>
          </Button>
        </div>
      </div>
      </ClientAuthGuard>
    );
  }

  return (
    <ClientAuthGuard>
    <div className="min-h-screen bg-background p-4 flex justify-center">
      <div className="w-full max-w-md pt-8 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold">Votre avis</h1>
              <p className="text-xs text-muted-foreground">Commande #{orderId}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 text-muted-foreground" asChild>
            <Link href="/client/orders">Mes commandes</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Évaluez votre expérience</CardTitle>
            <CardDescription>Votre avis aide à améliorer la confiance dans l'e-commerce algérien</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Note globale *</Label>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-sm font-medium text-yellow-600">{RATING_LABEL[rating]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                <Textarea
                  id="comment"
                  placeholder="Décrivez votre expérience : qualité produit, livraison, service..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!rating || submitFeedback.isPending}>
                {submitFeedback.isPending ? "Envoi..." : "Envoyer mon avis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </ClientAuthGuard>
  );
}
