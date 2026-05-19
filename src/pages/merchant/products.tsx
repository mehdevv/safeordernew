import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getGetProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Archive, Copy, ExternalLink, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  variants: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  variants: "",
};

export default function MerchantProducts() {
  const { t } = useTranslation("merchant");
  const { t: te } = useTranslation("errors");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [archiveId, setArchiveId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);

  function setField(field: keyof ProductFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(p: {
    id: number;
    name: string;
    category?: string | null;
    description?: string | null;
    price: number;
    stock?: number | null;
    variants?: string | null;
  }) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category ?? "",
      description: p.description ?? "",
      price: String(p.price),
      stock: p.stock != null ? String(p.stock) : "",
      variants: p.variants ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) return;
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return;
    const stock = form.stock ? parseInt(form.stock, 10) : undefined;
    try {
      if (editingId) {
        await updateProduct.mutateAsync({
          id: editingId,
          data: {
            name: form.name.trim(),
            category: form.category.trim() || undefined,
            description: form.description.trim() || undefined,
            price,
            stock: stock ?? undefined,
            variants: form.variants.trim() || undefined,
          },
        });
        toast({ title: te("productUpdated") });
      } else {
        await createProduct.mutateAsync({
          data: {
            name: form.name.trim(),
            category: form.category.trim() || undefined,
            description: form.description.trim() || undefined,
            price,
            stock: stock ?? undefined,
            variants: form.variants.trim() || undefined,
          },
        });
        toast({ title: te("productCreated") });
      }
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      setDialogOpen(false);
    } catch {
      toast({ title: te("genericErrorTitle"), description: te("productSaveFail"), variant: "destructive" });
    }
  }

  async function handleArchive() {
    if (archiveId == null) return;
    try {
      await deleteProduct.mutateAsync({ id: archiveId });
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      toast({ title: te("productArchived") });
      setArchiveId(null);
    } catch {
      toast({ title: te("genericErrorTitle"), description: te("productArchiveFail"), variant: "destructive" });
    }
  }

  function copyOrderLink(productId: number) {
    const url = `${window.location.origin}/order/${productId}`;
    navigator.clipboard.writeText(url);
    toast({ title: te("linkCopiedTitle"), description: te("linkCopiedDesc") });
  }

  const activeProducts = products?.filter(p => p.status === "active") ?? [];
  const archivedProducts = products?.filter(p => p.status === "archived") ?? [];

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("products.title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("products.subtitle")}</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("products.newProduct")}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : activeProducts.length === 0 ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center text-center gap-4">
              <div className="bg-muted p-5 rounded-full">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{t("products.emptyTitle")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("products.emptyHint")}</p>
              </div>
              <Button onClick={openAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("products.newProduct")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map(product => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{product.name}</p>
                      {product.category && <p className="text-xs text-muted-foreground">{product.category}</p>}
                    </div>
                    <Badge variant="outline" className="shrink-0 text-sm font-bold">
                      {product.price.toLocaleString("fr-DZ")} DZD
                    </Badge>
                  </div>

                  {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{t("products.ref", { ref: product.reference })}</span>
                    {product.stock != null && <span>· {t("products.stockLine", { n: product.stock })}</span>}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => copyOrderLink(product.id)}>
                      <Copy className="h-3.5 w-3.5" />
                      {t("products.linkBtn")}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open(`/order/${product.id}`, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(product)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => setArchiveId(product.id)}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {archivedProducts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">{t("products.archived", { n: archivedProducts.length })}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {archivedProducts.map(product => (
                <Card key={product.id} className="opacity-50">
                  <CardContent className="pt-4 pb-3">
                    <p className="font-medium text-sm line-through">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.price.toLocaleString("fr-DZ")} DZD</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? t("products.dialogEdit") : t("products.dialogAdd")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="prod-name">{t("products.nameLabel")}</Label>
              <Input id="prod-name" value={form.name} onChange={e => setField("name", e.target.value)} autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prod-price">{t("products.priceLabel")}</Label>
                <Input id="prod-price" type="number" min={0} step={100} value={form.price} onChange={e => setField("price", e.target.value)} placeholder="4500" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prod-stock">{t("products.stockLabel")}</Label>
                <Input id="prod-stock" type="number" min={0} value={form.stock} onChange={e => setField("stock", e.target.value)} placeholder="100" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-cat">{t("products.categoryLabel")}</Label>
              <Input id="prod-cat" value={form.category} onChange={e => setField("category", e.target.value)} placeholder={t("products.categoryPh")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-desc">{t("products.descLabel")}</Label>
              <Textarea id="prod-desc" rows={3} value={form.description} onChange={e => setField("description", e.target.value)} placeholder={t("products.descPh")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-variants">{t("products.variantsLabel")}</Label>
              <Input id="prod-variants" value={form.variants} onChange={e => setField("variants", e.target.value)} placeholder={t("products.variantsPh")} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("products.cancel")}</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.price || createProduct.isPending || updateProduct.isPending}>
              {createProduct.isPending || updateProduct.isPending
                ? t("products.saving")
                : editingId
                  ? t("products.update")
                  : t("products.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={archiveId != null} onOpenChange={open => !open && setArchiveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("products.archiveTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("products.archiveBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("products.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("products.archiveConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MerchantLayout>
  );
}
