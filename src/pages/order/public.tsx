import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetProductOrderLink, useCreateOrder } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Package, CheckCircle2, ArrowLeft, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara",
  "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
  "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane",
];

const SAFE_PAY_RATE = 0.1; // 10% dépôt Safe Pay

/** Affichage type maquette : « 3 200 DA » */
function formatDaAmount(n: number): string {
  return `${new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(Math.round(n))} DA`;
}

type PaymentMethod = "cib" | "dahabia" | "baridimob";

const DEPOSIT_PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  icon: LucideIcon;
  iconClass: string;
  boxClass: string;
}[] = [
  {
    id: "cib",
    label: "Carte bancaire CIB",
    icon: CreditCard,
    iconClass: "text-primary",
    boxClass: "bg-primary/10 border border-primary/25",
  },
  {
    id: "dahabia",
    label: "Carte Dahabia (CCP)",
    icon: Landmark,
    iconClass: "text-amber-700 dark:text-amber-500",
    boxClass: "bg-amber-500/10 border border-amber-500/25",
  },
  {
    id: "baridimob",
    label: "BaridiMob",
    icon: Smartphone,
    iconClass: "text-blue-700 dark:text-blue-400",
    boxClass: "bg-blue-500/10 border border-blue-500/25",
  },
];

export default function OrderPublic() {
  const params = useParams<{ productId: string }>();
  const productId = parseInt(params.productId ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useGetProductOrderLink(productId);
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<"details" | "payment">("details");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [form, setForm] = useState({
    clientFirstName: "",
    clientLastName: "",
    clientPhone: "",
    wilaya: "",
    commune: "",
    address: "",
    deliveryCompany: "",
    receptionMode: "domicile" as "domicile" | "bureau",
    remark: "",
  });

  function setField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function isDetailsValid() {
    return (
      form.clientFirstName.trim() &&
      form.clientLastName.trim() &&
      form.clientPhone.trim().length >= 9 &&
      form.wilaya &&
      form.commune.trim() &&
      form.address.trim() &&
      form.deliveryCompany
    );
  }

  async function handlePaymentConfirm() {
    if (!product || !selectedPayment) return;
    setPaymentProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 1200)); // simulate payment processing
      const order = await createOrder.mutateAsync({
        data: {
          productId: product.id,
          clientFirstName: form.clientFirstName.trim(),
          clientLastName: form.clientLastName.trim(),
          clientPhone: form.clientPhone.trim(),
          wilaya: form.wilaya,
          commune: form.commune.trim(),
          address: form.address.trim(),
          deliveryCompany: form.deliveryCompany,
          receptionMode: form.receptionMode,
          remark: form.remark.trim() || undefined,
          paymentMethod: selectedPayment,
        },
      });
      navigate(`/order/${productId}/confirmation?tracking=${order.trackingCode}`);
    } catch {
      toast({ title: "Erreur", description: "Impossible de passer la commande. Réessayez.", variant: "destructive" });
      setPaymentProcessing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex justify-center">
        <div className="w-full max-w-lg mt-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold">Produit introuvable</h2>
          <p className="text-muted-foreground text-sm mt-2">Ce lien est invalide ou expiré.</p>
        </div>
      </div>
    );
  }

  const deliveryCompanies: string[] = product.deliveryCompanies && product.deliveryCompanies.length > 0
    ? product.deliveryCompanies
    : ["Yalidine", "Zaki", "Maystro", "Yalitec"];
  const productPrice = product.price;
  const depositNow = Math.round(productPrice * SAFE_PAY_RATE);
  const balanceAtDelivery = Math.max(0, productPrice - depositNow);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-lg mx-auto pt-5 px-4 space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {step === "payment" && (
            <Button variant="ghost" size="icon" onClick={() => setStep("details")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "details" ? "bg-primary" : "bg-primary"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "payment" ? "bg-primary" : "bg-muted"}`} />
          </div>
          <span className="text-xs text-muted-foreground">{step === "details" ? "1/2" : "2/2"}</span>
        </div>

        {/* Trust header */}
        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border border-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{product.shopName}</p>
            <p className="text-xs text-muted-foreground">Trust Score: {product.trustScore}/100 · Protégé SafeOrder</p>
          </div>
        </div>

        {/* Product info */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold">{product.name}</p>
                {product.category && <p className="text-sm text-muted-foreground">{product.category}</p>}
                {product.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>}
              </div>
              <Badge variant="outline" className="text-base font-bold px-3 py-1 shrink-0">
                {product.price.toLocaleString('fr-DZ')} DZD
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ── Step 1: Order details ── */}
        {step === "details" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" value={form.clientFirstName} onChange={e => setField("clientFirstName", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" value={form.clientLastName} onChange={e => setField("clientLastName", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" type="tel" placeholder="06XXXXXXXX" value={form.clientPhone} onChange={e => setField("clientPhone", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Wilaya *</Label>
                  <Select value={form.wilaya} onValueChange={v => setField("wilaya", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="commune">Commune *</Label>
                  <Input id="commune" value={form.commune} onChange={e => setField("commune", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input id="address" value={form.address} onChange={e => setField("address", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Mode de réception *</Label>
                    <Select value={form.receptionMode} onValueChange={v => setField("receptionMode", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domicile">À domicile</SelectItem>
                        <SelectItem value="bureau">Bureau de poste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Transporteur *</Label>
                    <Select value={form.deliveryCompany} onValueChange={v => setField("deliveryCompany", v)}>
                      <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                      <SelectContent>
                        {deliveryCompanies.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="remark">Remarque (optionnel)</Label>
                  <Input id="remark" value={form.remark} onChange={e => setField("remark", e.target.value)} placeholder="Instructions particulières..." />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!isDetailsValid()}
                  onClick={() => setStep("payment")}
                >
                  Continuer vers le paiement →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: Payment ── */}
        {step === "payment" && (
          <div className="space-y-4">
            {/* Dépôt intelligent Safe Pay */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0 space-y-3">
                    <p className="font-bold text-base leading-tight">Dépôt intelligent Safe Pay</p>
                    <div>
                      <p className="font-semibold text-sm mb-1.5">Qu&apos;est-ce que le dépôt intelligent ?</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Vous payez {formatDaAmount(depositNow)} (10% de la commande). Ce montant est déduit du prix
                        final — vous paierez {formatDaAmount(balanceAtDelivery)} à la livraison au lieu de{" "}
                        {formatDaAmount(productPrice)}. Il protège le vendeur des frais de retour si vous ne
                        récupérez pas votre colis.
                      </p>
                    </div>
                    <div className="space-y-2 rounded-lg border border-primary/15 bg-background/80 px-3 py-3 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Prix produit</span>
                        <span className="font-medium tabular-nums">{formatDaAmount(productPrice)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">— Dépôt payé maintenant</span>
                        <span className="font-semibold text-primary tabular-nums">- {formatDaAmount(depositNow)}</span>
                      </div>
                      <div className="flex justify-between gap-3 border-t border-border pt-2">
                        <span className="font-medium">À payer à la livraison</span>
                        <span className="font-bold tabular-nums">{formatDaAmount(balanceAtDelivery)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payer le dépôt */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payer le dépôt via :</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEPOSIT_PAYMENT_OPTIONS.map(option => {
                  const selected = selectedPayment === option.id;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedPayment(option.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${option.boxClass}`}>
                          <Icon className={`h-5 w-5 ${option.iconClass}`} aria-hidden />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{option.label}</p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                            selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {selected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Instructions de paiement (montant = dépôt) */}
            {selectedPayment && (
              <Card className="border-dashed">
                <CardContent className="pt-4 pb-4 text-sm space-y-2">
                  <p className="font-semibold">Instructions de paiement</p>
                  {selectedPayment === "baridimob" && (
                    <>
                      <p className="text-muted-foreground">
                        1. Ouvrez l&apos;application <strong>BaridiMob</strong>
                      </p>
                      <p className="text-muted-foreground">
                        2. Sélectionnez <strong>Paiement marchand</strong>
                      </p>
                      <p className="text-muted-foreground">
                        3. Entrez le montant du dépôt :{" "}
                        <strong className="text-primary">{formatDaAmount(depositNow)}</strong>
                      </p>
                      <p className="text-muted-foreground">4. Validez et confirmez votre commande</p>
                    </>
                  )}
                  {selectedPayment === "dahabia" && (
                    <>
                      <p className="text-muted-foreground">
                        1. Préparez votre <strong>carte Dahabia (CCP)</strong>
                      </p>
                      <p className="text-muted-foreground">
                        2. Montant du dépôt à payer :{" "}
                        <strong className="text-primary">{formatDaAmount(depositNow)}</strong>
                      </p>
                      <p className="text-muted-foreground">3. Confirmez le paiement sécurisé</p>
                    </>
                  )}
                  {selectedPayment === "cib" && (
                    <>
                      <p className="text-muted-foreground">
                        1. Saisissez les informations de votre <strong>carte bancaire CIB</strong>
                      </p>
                      <p className="text-muted-foreground">
                        2. Montant du dépôt : <strong className="text-primary">{formatDaAmount(depositNow)}</strong>
                      </p>
                      <p className="text-muted-foreground">3. Validez le paiement 3D Secure si demandé</p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order summary */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4 pb-4 text-sm space-y-1">
                <p className="font-semibold mb-2">Récapitulatif</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produit</span>
                  <span>{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{form.wilaya}, {form.commune} · {form.deliveryCompany}</span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{product.price.toLocaleString('fr-DZ')} DZD</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={!selectedPayment || paymentProcessing}
              onClick={handlePaymentConfirm}
            >
              {paymentProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Traitement en cours...
                </span>
              ) : (
                "Valider ma commande ›"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
