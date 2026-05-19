import { useState, useEffect } from "react";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetMe, useUpdateMerchant } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MerchantProfile() {
  const { data: merchant, isLoading } = useGetMe();
  const updateMerchant = useUpdateMerchant();
  const { toast } = useToast();

  const [form, setForm] = useState({ shopName: "", phone: "", phone2: "", wilaya: "", address: "" });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (merchant) {
      setForm({
        shopName: merchant.shopName ?? "",
        phone: merchant.phone1 ?? "",
        phone2: merchant.phone2 ?? "",
        wilaya: merchant.wilaya ?? "",
        address: merchant.address ?? "",
      });
    }
  }, [merchant]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!merchant) return;
    try {
      await updateMerchant.mutateAsync({
        id: merchant.id,
        data: {
          shopName: form.shopName || undefined,
          phone1: form.phone || undefined,
          phone2: form.phone2.trim() ? form.phone2 : undefined,
          wilaya: form.wilaya || undefined,
          address: form.address || undefined,
        },
      });
      setDirty(false);
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le profil.", variant: "destructive" });
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copié !", description: `${label} copié dans le presse-papiers.` });
    });
  }

  if (isLoading) {
    return (
      <MerchantLayout>
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          {merchant?.status && (
            <Badge variant={merchant.status === "active" ? "default" : "secondary"} className="capitalize">
              {merchant.status}
            </Badge>
          )}
        </div>

        {/* Trust info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold">{merchant?.shopName}</p>
              <p className="text-sm text-muted-foreground">Trust Score : {merchant?.trustScore ?? 100}/100</p>
            </div>
          </CardContent>
        </Card>

        {/* Merchant codes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Codes Marchand</CardTitle>
            <CardDescription>Partagez ces informations avec vos clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Code Marchand</p>
                <p className="font-mono font-bold">{merchant?.merchantCode}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(merchant?.merchantCode ?? "", "Code marchand")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-mono text-sm">{merchant?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(merchant?.email ?? "", "Email")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations de la boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="shopName">Nom de la boutique</Label>
                <Input id="shopName" value={form.shopName} onChange={e => set("shopName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Téléphone 1</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone2">Téléphone 2 (optionnel)</Label>
                <Input id="phone2" type="tel" value={form.phone2} onChange={e => set("phone2", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wilaya">Wilaya</Label>
                  <Input id="wilaya" value={form.wilaya} onChange={e => set("wilaya", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" value={form.address} onChange={e => set("address", e.target.value)} />
                </div>
              </div>
              <Button type="submit" disabled={!dirty || updateMerchant.isPending}>
                {updateMerchant.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  );
}
