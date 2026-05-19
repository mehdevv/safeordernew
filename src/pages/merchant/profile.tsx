import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetMe, useUpdateMerchant } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MerchantProfile() {
  const { t } = useTranslation("merchant");
  const { t: te } = useTranslation("errors");
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
      toast({ title: te("profileUpdatedTitle"), description: te("profileUpdatedDesc") });
    } catch {
      toast({ title: te("genericErrorTitle"), description: te("profileUpdateFailDesc"), variant: "destructive" });
    }
  }

  function copyToClipboard(text: string, labelKey: "copyCode" | "copyEmail") {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("profile.copiedTitle"),
        description: t("profile.copiedDesc", { label: t(`profile.${labelKey}`) }),
      });
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
          <h1 className="text-3xl font-bold tracking-tight">{t("profile.title")}</h1>
          {merchant?.status && (
            <Badge variant={merchant.status === "active" ? "default" : "secondary"} className="capitalize">
              {merchant.status === "active" ? t("profile.active") : t("profile.inactive")}
            </Badge>
          )}
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold">{merchant?.shopName}</p>
              <p className="text-sm text-muted-foreground">{t("profile.trustLine", { score: merchant?.trustScore ?? 100 })}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("profile.codesTitle")}</CardTitle>
            <CardDescription>{t("profile.codesDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">{t("profile.codeLabel")}</p>
                <p className="font-mono font-bold">{merchant?.merchantCode}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(merchant?.merchantCode ?? "", "copyCode")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">{t("profile.emailLabel")}</p>
                <p className="font-mono text-sm">{merchant?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(merchant?.email ?? "", "copyEmail")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("profile.shopInfoTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="shopName">{t("profile.labelShop")}</Label>
                <Input id="shopName" value={form.shopName} onChange={e => set("shopName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">{t("profile.labelPhone")}</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone2">{t("profile.labelPhone2")}</Label>
                <Input id="phone2" type="tel" value={form.phone2} onChange={e => set("phone2", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wilaya">{t("profile.labelWilaya")}</Label>
                  <Input id="wilaya" value={form.wilaya} onChange={e => set("wilaya", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">{t("profile.labelAddress")}</Label>
                  <Input id="address" value={form.address} onChange={e => set("address", e.target.value)} />
                </div>
              </div>
              <Button type="submit" disabled={!dirty || updateMerchant.isPending}>
                {updateMerchant.isPending ? t("profile.saving") : t("profile.save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  );
}
