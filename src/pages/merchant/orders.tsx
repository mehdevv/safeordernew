import { useState } from "react";
import { MerchantLayout } from "@/components/merchant/layout";
import { 
  useGetOrders,
  useUpdateOrderStatus,
  getGetOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { orderStatusBadgeClass } from "@/lib/order-status-styles";

const STATUS_LABELS: Record<string, string> = {
  confirmation: "Confirmation",
  preparation: "Préparation",
  dispatch: "Expédition",
  en_livraison: "En livraison",
  livre: "Livré",
  retour: "Retour",
};

export default function MerchantOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const params = activeTab === "all" ? {} : { status: activeTab };
  const { data: orders, isLoading } = useGetOrders(params, {
    query: { queryKey: getGetOrdersQueryKey(params) }
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatus.mutate(
      { id: orderId, data: { status: status as "confirmation" | "preparation" | "dispatch" | "en_livraison" | "livre" | "retour" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
          toast({ title: "Statut mis à jour" });
        },
      }
    );
  };

  const filtered = orders?.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.trackingCode.toLowerCase().includes(q) ||
      o.clientFirstName.toLowerCase().includes(q) ||
      o.clientLastName.toLowerCase().includes(q) ||
      o.clientPhone.includes(q)
    );
  }) ?? [];

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une commande..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
              data-testid="input-search-orders"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
            <TabsTrigger value="all" data-testid="tab-all">Toutes</TabsTrigger>
            <TabsTrigger value="confirmation" data-testid="tab-confirmation">Confirmation</TabsTrigger>
            <TabsTrigger value="preparation" data-testid="tab-preparation">Préparation</TabsTrigger>
            <TabsTrigger value="dispatch" data-testid="tab-dispatch">Expédition</TabsTrigger>
            <TabsTrigger value="en_livraison" data-testid="tab-en_livraison">En livraison</TabsTrigger>
            <TabsTrigger value="livre" data-testid="tab-livre">Livrées</TabsTrigger>
            <TabsTrigger value="retour" data-testid="tab-retour">Retours</TabsTrigger>
          </TabsList>

          <Card className="mt-4 border-muted">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code Tracking</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Wilaya</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Safe Pay</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Chargement des commandes...</TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune commande trouvée</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" data-testid={`row-order-${order.id}`}>
                        <TableCell className="font-mono text-sm">{order.trackingCode}</TableCell>
                        <TableCell className="font-medium">
                          {order.clientFirstName} {order.clientLastName}
                          <div className="text-xs text-muted-foreground">{order.clientPhone}</div>
                        </TableCell>
                        <TableCell>{order.wilaya}</TableCell>
                        <TableCell className="font-medium">{order.totalPrice.toLocaleString('fr-DZ')} DZD</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            order.safePayStatus === 'paid' ? 'border-success text-success' :
                            order.safePayStatus === 'pending' ? 'border-warning text-warning' :
                            order.safePayStatus === 'deducted' ? 'border-primary text-primary' : 'border-muted'
                          }>
                            {order.safePayStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(val) => handleStatusChange(order.id, val)}
                          >
                            <SelectTrigger className={`h-7 text-xs px-2 border-transparent ${orderStatusBadgeClass(order.status)}`} data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                <SelectItem key={val} value={val}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </MerchantLayout>
  );
}
