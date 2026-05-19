import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive shrink-0" />
            <h1 className="text-2xl font-bold text-foreground">404 — Page introuvable</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Cette adresse ne correspond à aucune page. Vérifiez l’URL ou retournez à l’accueil.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
