"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import Header from "../components/Header";

type Demande = {
  id: string;
  date: string;
  type: string;
  montant: number;
  statut: "En cours" | "Accepté" | "Refusé";
  commentaire?: string;
};

export default function Admin() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [newStatut, setNewStatut] = useState<Demande["statut"]>("En cours");
  const [commentaire, setCommentaire] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("demandes");
    if (saved) setDemandes(JSON.parse(saved));
  }, []);

  const updateStatut = () => {
    if (!selectedId) return alert("Sélectionnez une demande");

    setIsUpdating(true);
    const updated = demandes.map(d =>
      d.id === selectedId ? { ...d, statut: newStatut, commentaire: commentaire || d.commentaire } : d
    );

    setDemandes(updated);
    localStorage.setItem("demandes", JSON.stringify(updated));

    setTimeout(() => {
      setIsUpdating(false);
      alert("✅ Mise à jour effectuée");
      setCommentaire("");
    }, 700);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24">
  <Header />
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-5xl font-bold">Administration Essor Crédit</h1>
        <p className="text-zinc-400">Gestion des demandes clients</p>
      </div>
      <Button onClick={() => window.location.reload()} variant="outline" className="border-zinc-700">
        <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
      </Button>
    </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Liste des demandes */}
          <div className="lg:col-span-7">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Liste des demandes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demandes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer hover:border-emerald-600 ${selectedId === d.id ? 'border-emerald-600 bg-zinc-800' : 'border-zinc-800'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-mono text-sm text-zinc-500">{d.id}</p>
                        <p className="text-2xl font-bold mt-1">{d.montant.toLocaleString('fr-FR')} €</p>
                        <p className="text-zinc-400">{d.type} • {d.date}</p>
                      </div>
                      <Badge className={
                        d.statut === "Accepté" ? "bg-emerald-600" :
                        d.statut === "En cours" ? "bg-amber-600" : "bg-red-600"
                      }>
                        {d.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Panneau de mise à jour */}
          <div className="lg:col-span-5">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-8">
              <CardHeader>
                <CardTitle>Mise à jour du statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <Select onValueChange={setSelectedId} value={selectedId}>
                  <SelectTrigger className="h-14 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Sélectionner une demande" />
                  </SelectTrigger>
                  <SelectContent>
                    {demandes.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.id} — {d.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(v: any) => setNewStatut(v)} value={newStatut}>
                  <SelectTrigger className="h-14 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Accepté">Accepté</SelectItem>
                    <SelectItem value="Refusé">Refusé</SelectItem>
                  </SelectContent>
                </Select>

                <div>
                  <label className="block text-sm mb-3 text-zinc-400">Commentaire client</label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-3xl p-6 text-white resize-y focus:border-emerald-600"
                    placeholder="Message visible par le client..."
                  />
                </div>

                <Button 
                  onClick={updateStatut} 
                  disabled={!selectedId || isUpdating}
                  className="w-full h-14 text-lg bg-white text-black hover:bg-white/90"
                >
                  {isUpdating ? "Mise à jour..." : "Enregistrer le changement"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}