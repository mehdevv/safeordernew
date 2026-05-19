import { useState } from "react";
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
  name: "", category: "", description: "", price: "", stock: "", variants: "",
};

export default function MerchantProducts() {
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

  function openEdit(p: { id: number; name: string; category?: string | null; description?: string | null; price: number; stock?: number | null; variants?: string | null }) {
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
        toast({ title: "Produit mis à jour" });
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
        toast({ title: "Produit créé !" });
      }
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      setDialogOpen(false);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le produit.", variant: "destructive" });
    }
  }

  async function handleArchive() {
    if (archiveId == null) return;
    try {
      await deleteProduct.mutateAsync({ id: archiveId });
      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      toast({ title: "Produit archivé" });
      setArchiveId(null);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'archiver le produit.", variant: "destructive" });
    }
  }

  function copyOrderLink(productId: number) {
    const url = `${window.location.origin}/order/${productId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Lien copié !", description: "Partagez ce lien avec vos clients." });
  }

  const activeProducts = products?.filter(p => p.status === "active") ?? [];
  const archivedProducts = products?.filter(p => p.status === "archived") ?? [];

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
            <p className="text-muted-foreground text-sm mt-1">Gérez votre catalogue et générez des liens de commande</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : activeProducts.length === 0 ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center text-center gap-4">
              <div className="bg-muted p-5 rounded-full">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Aucun produit encore</p>
                <p className="text-sm text-muted-foreground mt-1">Ajoutez votre premier produit pour générer un lien de commande</p>
              </div>
              <Button onClick={openAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
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
                      {product.category && (
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0 text-sm font-bold">
                      {product.price.toLocaleString('fr-DZ')} DZD
                    </Badge>
                  </div>

                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">REF: {product.reference}</span>
                    {product.stock != null && (
                      <span>· Stock: {product.stock}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => copyOrderLink(product.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Lien
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => window.open(`/order/${product.id}`, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => openEdit(product)}
                    >
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
            <h2 className="text-sm font-medium text-muted-foreground">Archivés ({archivedProducts.length})</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {archivedProducts.map(product => (
                <Card key={product.id} className="opacity-50">
                  <CardContent className="pt-4 pb-3">
                    <p className="font-medium text-sm line-through">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.price.toLocaleString('fr-DZ')} DZD</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="prod-name">Nom du produit *</Label>
              <Input id="prod-name" value={form.name} onChange={e => setField("name", e.target.value)} autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prod-price">Prix (DZD) *</Label>
                <Input id="prod-price" type="number" min={0} step={100} value={form.price} onChange={e => setField("price", e.target.value)} placeholder="4500" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prod-stock">Stock</Label>
                <Input id="prod-stock" type="number" min={0} value={form.stock} onChange={e => setField("stock", e.target.value)} placeholder="100" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-cat">Catégorie</Label>
              <Input id="prod-cat" value={form.category} onChange={e => setField("category", e.target.value)} placeholder="Électronique, Mode, Maison..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea id="prod-desc" rows={3} value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Décrivez votre produit..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prod-variants">Variantes</Label>
              <Input id="prod-variants" value={form.variants} onChange={e => setField("variants", e.target.value)} placeholder="Taille: S/M/L/XL, Couleur: Rouge/Bleu" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim() || !form.price || createProduct.isPending || updateProduct.isPending}
            >
              {createProduct.isPending || updateProduct.isPending ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer le produit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation */}
      <AlertDialog open={archiveId != null} onOpenChange={open => !open && setArchiveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le lien de commande ne sera plus accessible. Cette action peut être annulée en éditant le produit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MerchantLayout>
  );
}
