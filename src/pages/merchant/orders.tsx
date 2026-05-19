import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MerchantLayout } from "@/components/merchant/layout";
import { useGetOrders, useUpdateOrderStatus, getGetOrdersQueryKey } from "@workspace/api-client-react";
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
import i18n from "@/i18n";

const STATUS_IDS = ["confirmation", "preparation", "dispatch", "en_livraison", "livre", "retour"] as const;

export default function MerchantOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation("merchant");
  const { t: tc } = useTranslation("common");
  const { t: te } = useTranslation("errors");

  const params: Record<string, string> = activeTab === "all" ? {} : { status: activeTab };
  const { data: orders, isLoading } = useGetOrders(params, {
    query: { queryKey: getGetOrdersQueryKey(params) },
  });

  const updateStatus = useUpdateOrderStatus();

  const statusLabels = useMemo(() => {
    const m: Record<string, string> = {};
    for (const id of STATUS_IDS) {
      m[id] = tc(`orderStatus.${id}`);
    }
    return m;
  }, [tc]);

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatus.mutate(
      {
        id: orderId,
        data: { status: status as "confirmation" | "preparation" | "dispatch" | "en_livraison" | "livre" | "retour" },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
          toast({ title: te("orderStatusUpdated") });
        },
      },
    );
  };

  const filtered =
    orders?.filter(o => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.trackingCode.toLowerCase().includes(q) ||
        o.clientFirstName.toLowerCase().includes(q) ||
        o.clientLastName.toLowerCase().includes(q) ||
        o.clientPhone.includes(q)
      );
    }) ?? [];

  const dateLocale = i18n.language?.startsWith("ar") ? "ar-DZ" : "fr-FR";

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{t("orders.title")}</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("orders.searchPlaceholder")}
              className="ps-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
              data-testid="input-search-orders"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
            <TabsTrigger value="all" data-testid="tab-all">
              {t("orders.statusTab.all")}
            </TabsTrigger>
            {STATUS_IDS.map(id => (
              <TabsTrigger key={id} value={id} data-testid={`tab-${id}`}>
                {t(`orders.statusTab.${id}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="mt-4 border-muted">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orders.thCode")}</TableHead>
                    <TableHead>{t("orders.thClient")}</TableHead>
                    <TableHead>{t("orders.thWilaya")}</TableHead>
                    <TableHead>{t("orders.thAmount")}</TableHead>
                    <TableHead>{t("orders.thSafePay")}</TableHead>
                    <TableHead>{t("orders.thStatus")}</TableHead>
                    <TableHead className="text-end">{t("orders.thDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("orders.loading")}
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("orders.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(order => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" data-testid={`row-order-${order.id}`}>
                        <TableCell className="font-mono text-sm">{order.trackingCode}</TableCell>
                        <TableCell className="font-medium">
                          {order.clientFirstName} {order.clientLastName}
                          <div className="text-xs text-muted-foreground">{order.clientPhone}</div>
                        </TableCell>
                        <TableCell>{order.wilaya}</TableCell>
                        <TableCell className="font-medium">{order.totalPrice.toLocaleString("fr-DZ")} DZD</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              order.safePayStatus === "paid"
                                ? "border-success text-success"
                                : order.safePayStatus === "pending"
                                  ? "border-warning text-warning"
                                  : order.safePayStatus === "deducted"
                                    ? "border-primary text-primary"
                                    : "border-muted"
                            }
                          >
                            {order.safePayStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={val => handleStatusChange(order.id, val)}>
                            <SelectTrigger
                              className={`h-7 text-xs px-2 border-transparent ${orderStatusBadgeClass(order.status)}`}
                              data-testid={`select-status-${order.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_IDS.map(val => (
                                <SelectItem key={val} value={val}>
                                  {statusLabels[val]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-end text-muted-foreground text-sm">
                          {new Date(order.createdAt).toLocaleDateString(dateLocale)}
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
