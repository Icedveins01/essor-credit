"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import Header from "../components/Header";

type Demande = {
  id: string;
  date: string;
  type: string;
  montant: number;
  statut: "En cours" | "Accepté" | "Refusé";
  commentaire?: string;
};

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [demandes, setDemandes] = useState<Demande[]>([]);

  const PASSWORD_CORRECT = "1234";

  useEffect(() => {
    const saved = localStorage.getItem("demandes");
    if (saved) {
      const parsed = JSON.parse(saved);
      const cleaned = parsed.map((d: any) => ({
        ...d,
        statut: d.statut === "En étude" ? "En cours" : d.statut
      }));
      setDemandes(cleaned);
    } else {
      const demo: Demande[] = [
        { id: "D-20260428-001", date: "28/04/2026", type: "Crédit Immobilier", montant: 285000, statut: "Accepté", commentaire: "Dossier validé - Virement prévu le 05/05" },
        { id: "D-20260429-002", date: "29/04/2026", type: "Prêt Personnel", montant: 45000, statut: "En cours", commentaire: "En cours d'analyse" },
        { id: "D-20260430-003", date: "30/04/2026", type: "Rachat de Crédit", montant: 98000, statut: "En cours" },
        { id: "D-20260427-004", date: "27/04/2026", type: "Prêt Auto", montant: 32000, statut: "Refusé", commentaire: "Score de solvabilité insuffisant" },
      ];
      setDemandes(demo);
      localStorage.setItem("demandes", JSON.stringify(demo));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD_CORRECT) setIsLoggedIn(true);
    else alert("Code incorrect → 1234");
  };

  const getStatus = (statut: Demande["statut"]) => {
    if (statut === "Accepté") return { color: "bg-emerald-600", icon: <CheckCircle className="w-5 h-5" />, label: "Accepté" };
    if (statut === "En cours") return { color: "bg-amber-600", icon: <Clock className="w-5 h-5" />, label: "En cours" };
    return { color: "bg-red-600", icon: <XCircle className="w-5 h-5" />, label: "Refusé" };
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Header />
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white shadow-2xl">
          <CardHeader className="text-center pt-12">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
              👤
            </div>
            <CardTitle className="text-3xl">Espace Client</CardTitle>
            <p className="text-zinc-400">Accédez au suivi de vos dossiers</p>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            <form onSubmit={handleLogin}>
              <div>
                <label className="text-sm text-zinc-400 block mb-2">Code d'accès sécurisé</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 text-lg focus:border-emerald-600 outline-none"
                  placeholder="••••"
                />
              </div>
              <Button type="submit" className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 mt-6">
                Accéder à mon espace
              </Button>
            </form>
            <p className="text-center text-xs text-zinc-500">Code de démonstration : <span className="font-mono">1234</span></p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24">
  <Header />
  <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="flex justify-between items-end mb-12">
      <div>
        <h1 className="text-5xl font-bold">Mon Espace Client</h1>
        <p className="text-zinc-400 mt-2">Bienvenue • Suivi en temps réel</p>
      </div>
      <Button onClick={() => window.location.href = "/#demande"} className="bg-emerald-600 hover:bg-emerald-700">
        Nouvelle Demande <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>

        <div className="grid gap-6">
          {demandes.map((d) => {
            const status = getStatus(d.statut);
            return (
              <Card key={d.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group">
                <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <p className="font-mono text-sm text-zinc-500">{d.id}</p>
                      <p className="text-lg font-semibold text-white">{d.type}</p>
                    </div>
                    <p className="text-4xl font-bold">{d.montant.toLocaleString('fr-FR')} €</p>
                    <p className="text-zinc-400 mt-1">Demandé le {d.date}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={`${status.color} text-white px-6 py-2 text-sm flex items-center gap-2`}>
                      {status.icon}
                      {status.label}
                    </Badge>
                    {d.commentaire && (
                      <p className="text-sm text-zinc-400 max-w-xs text-right">{d.commentaire}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}