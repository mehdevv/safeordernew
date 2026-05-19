import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Search } from "lucide-react";

export default function SafeTrack() {
  const [code, setCode] = useState("");
  const [, navigate] = useLocation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) navigate(`/track/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">SafeTrack</h1>
          <p className="text-muted-foreground text-sm">
            Suivez votre commande en temps réel. Entrez votre code de suivi pour voir l'état de votre livraison.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suivi de commande</CardTitle>
            <CardDescription>Votre code commence par SAF-</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="SAF-XXXXXXX"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="font-mono uppercase"
                  autoFocus
                />
                <Button type="submit" disabled={!code.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={!code.trim()}>
                Suivre ma commande
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Vous avez passé commande ? Retrouvez votre code dans le SMS de confirmation.
        </p>
      </div>
    </div>
  );
}
