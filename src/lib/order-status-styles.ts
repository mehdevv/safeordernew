/**
 * Order lifecycle — soft badges & pipeline accents aligned with global SafeOrder theme
 * (primary blue, warning amber, success mint, chart accents).
 */
export type OrderStatusKey =
  | "confirmation"
  | "preparation"
  | "dispatch"
  | "en_livraison"
  | "livre"
  | "retour";

const BADGE: Record<OrderStatusKey, string> = {
  confirmation: "bg-primary/15 text-primary",
  preparation: "bg-warning/20 text-warning-foreground",
  dispatch: "bg-chart-5/15 text-chart-5",
  en_livraison: "bg-chart-2/20 text-chart-2",
  livre: "bg-success/15 text-success",
  retour: "bg-destructive/15 text-destructive",
};

const BORDER_TOP: Record<OrderStatusKey, string> = {
  confirmation: "border-t-primary",
  preparation: "border-t-warning",
  dispatch: "border-t-chart-5",
  en_livraison: "border-t-chart-2",
  livre: "border-t-success",
  retour: "border-t-destructive",
};

export function orderStatusBadgeClass(status: string): string {
  return BADGE[status as OrderStatusKey] ?? "bg-muted text-muted-foreground";
}

export function orderStatusBorderTopClass(status: string): string {
  return BORDER_TOP[status as OrderStatusKey] ?? "border-t-border";
}
