import { MerchantLayout } from "@/components/merchant/layout";
import { 
  useGetDashboardStats, 
  useGetDashboardPipeline,
  useGetRecentOrders,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { orderStatusBorderTopClass } from "@/lib/order-status-styles";

const PIPELINE_COLS = [
  { id: "confirmation" as const, label: "Confirmation" },
  { id: "preparation" as const, label: "Préparation" },
  { id: "dispatch" as const, label: "Expédition" },
  { id: "en_livraison" as const, label: "En livraison" },
  { id: "livre" as const, label: "Livré" },
  { id: "retour" as const, label: "Retour" },
];

export default function MerchantDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: pipeline, isLoading: pipelineLoading } = useGetDashboardPipeline();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders();

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes du jour</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-7 w-20" /> : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-orders-today">{stats?.ordersToday ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {(stats?.ordersTodayDelta ?? 0) > 0 ? "+" : ""}{stats?.ordersTodayDelta ?? 0} par rapport à hier
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenu (Mois)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-7 w-24" /> : (
                <div className="text-2xl font-bold" data-testid="text-revenue-month">
                  {(stats?.revenueMonth ?? 0).toLocaleString('fr-DZ')} DZD
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de livraison</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-7 w-16" /> : (
                <div className="text-2xl font-bold text-success" data-testid="text-delivery-rate">{stats?.deliveryRate ?? 0}%</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-7 w-12" /> : (
                <div className="text-2xl font-bold text-primary" data-testid="text-trust-score">{stats?.trustScore ?? 100}/100</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Kanban */}
        <div>
          <h2 className="text-xl font-bold mb-4">Pipeline des Commandes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PIPELINE_COLS.map(col => {
              const count = pipeline ? pipeline[col.id] : 0;
              return (
                <Card key={col.id} className={`shadow-sm border-t-4 ${orderStatusBorderTopClass(col.id)}`} data-testid={`pipeline-col-${col.id}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                      <span className="truncate">{col.label}</span>
                      <Badge variant="secondary">{pipelineLoading ? "-" : (count ?? 0)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 min-h-[80px]">
                    {pipelineLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : (
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        {count ?? 0} commande{(count ?? 0) !== 1 ? "s" : ""}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4">Commandes Récentes</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {ordersLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : !recentOrders?.length ? (
                  <div className="p-8 text-center text-muted-foreground">Aucune commande récente</div>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/50" data-testid={`row-recent-order-${order.id}`}>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-sm">{order.clientFirstName} {order.clientLastName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{order.trackingCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{order.totalPrice.toLocaleString('fr-DZ')} DZD</span>
                        <Badge variant="secondary" className="text-xs">{order.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MerchantLayout>
  );
}
