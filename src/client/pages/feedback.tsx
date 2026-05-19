import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useSubmitFeedback, useGetFeedbackByOrder } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClientAuthGuard } from "@/client/components/client-auth-guard";
import { LanguageSwitch } from "@/components/LanguageSwitch";

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

export default function ClientFeedback() {
  const params = useParams<{ orderId: string }>();
  const orderId = parseInt(params.orderId ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation("client");
  const { t: te } = useTranslation("errors");

  const ratingLabels = ["", t("feedback.rating1"), t("feedback.rating2"), t("feedback.rating3"), t("feedback.rating4"), t("feedback.rating5")];

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
      toast({ title: te("genericErrorTitle"), description: te("feedbackSubmitFail"), variant: "destructive" });
    }
  }

  if (submitted || existing) {
    const displayRating = submitted ? rating : existing?.rating;
    const displayComment = submitted ? comment : existing?.comment;
    return (
      <ClientAuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center space-y-5">
            <div className="flex justify-end">
              <LanguageSwitch />
            </div>
            <div className="flex justify-center">
              <div className="bg-success/15 p-4 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{t("feedback.thanksHeading")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("feedback.thanksLead")}</p>
            </div>
            {displayRating ? (
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`h-6 w-6 ${s <= (displayRating ?? 0) ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            ) : null}
            {displayComment ? (
              <Card className="text-start">
                <CardContent className="pt-4 text-sm text-muted-foreground italic">&quot;{displayComment}&quot;</CardContent>
              </Card>
            ) : null}
            <Button variant="outline" className="w-full" onClick={() => navigate("/track")}>
              {t("feedback.trackMoreOrders")}
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link href="/client/dashboard">{t("feedback.backMySpace")}</Link>
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
                <h1 className="text-xl font-bold">{t("feedback.pageHeading")}</h1>
                <p className="text-xs text-muted-foreground">{t("feedback.orderRef", { id: orderId })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <LanguageSwitch />
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link href="/client/orders">{t("feedback.backOrders")}</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("feedback.evaluateTitle")}</CardTitle>
              <CardDescription>{t("feedback.evaluateDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>{t("feedback.noteGlobal")}</Label>
                  <StarRating value={rating} onChange={setRating} />
                  {rating > 0 && <p className="text-sm font-medium text-yellow-600">{ratingLabels[rating]}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">{t("feedback.commentLabel")}</Label>
                  <Textarea id="comment" placeholder={t("feedback.commentPh")} value={comment} onChange={e => setComment(e.target.value)} rows={4} />
                </div>

                <Button type="submit" className="w-full" disabled={!rating || submitFeedback.isPending}>
                  {submitFeedback.isPending ? t("feedback.sending") : t("feedback.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientAuthGuard>
  );
}
