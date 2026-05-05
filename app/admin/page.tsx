"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, RefreshCw, Search, User, Phone, Mail, MapPin } from "lucide-react";
import Header from "../components/Header";
import { motion } from "framer-motion";

type Demande = {
  id: string;
  date: string;
  type: string;
  montant: number;
  statut: "En cours" | "Accepté" | "Refusé";
  commentaire?: string;
  client?: {
    prenom: string;
    nom: string;
    telephone: string;
    email: string;
    adresse: string;
    ville: string;
    pays: string;
    typeClient: string;
    revenuOuCA?: string;
    charges?: string;
    message?: string;
  };
};

export default function Admin() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tous" | "En cours" | "Accepté" | "Refusé">("Tous");
  const [selectedId, setSelectedId] = useState("");
  const [newStatut, setNewStatut] = useState<"En cours" | "Accepté" | "Refusé">("En cours");
  const [commentaire, setCommentaire] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("demandes");
    if (saved) setDemandes(JSON.parse(saved));
  }, []);

  const selectedDemande = demandes.find(d => d.id === selectedId);

  const filteredDemandes = useMemo(() => {
    return demandes
      .filter(d => {
        const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             d.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "Tous" || d.statut === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [demandes, searchTerm, statusFilter]);

  const stats = {
    total: demandes.length,
    enCours: demandes.filter(d => d.statut === "En cours").length,
    acceptes: demandes.filter(d => d.statut === "Accepté").length,
    refuses: demandes.filter(d => d.statut === "Refusé").length,
  };

  const updateStatut = () => {
    if (!selectedId) return alert("Sélectionnez une demande");
    setIsUpdating(true);

    const updated = demandes.map(d =>
      d.id === selectedId ? { ...d, statut: newStatut, commentaire } : d
    );

    setDemandes(updated);
    localStorage.setItem("demandes", JSON.stringify(updated));

    setTimeout(() => {
      setIsUpdating(false);
      alert("✅ Mise à jour effectuée !");
      setCommentaire("");
    }, 700);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-bold">Administration Essor Crédit</h1>
            <p className="text-zinc-400 mt-2">Gestion complète des demandes clients</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-zinc-900 border-zinc-800 p-6"><p className="text-zinc-400">Total</p><p className="text-5xl font-bold mt-3">{stats.total}</p></Card>
          <Card className="bg-zinc-900 border-zinc-800 p-6"><p className="text-amber-400">En cours</p><p className="text-5xl font-bold mt-3">{stats.enCours}</p></Card>
          <Card className="bg-emerald-600/10 border-emerald-600/30 p-6"><p className="text-emerald-400">Acceptées</p><p className="text-5xl font-bold mt-3 text-emerald-400">{stats.acceptes}</p></Card>
          <Card className="bg-red-600/10 border-red-600/30 p-6"><p className="text-red-400">Refusées</p><p className="text-5xl font-bold mt-3 text-red-400">{stats.refuses}</p></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Liste des demandes */}
          <div className="lg:col-span-7">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Toutes les demandes</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-zinc-800 border-zinc-700" />
                    </div>
                    <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                      <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Accepté">Accepté</SelectItem>
                        <SelectItem value="Refusé">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                        <th className="text-left py-4">Dossier</th>
                        <th className="text-left py-4">Client</th>
                        <th className="text-left py-4">Type</th>
                        <th className="text-left py-4">Montant</th>
                        <th className="text-left py-4">Date</th>
                        <th className="text-left py-4">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {filteredDemandes.map(d => (
                        <tr key={d.id} onClick={() => setSelectedId(d.id)} className={`hover:bg-zinc-800 cursor-pointer ${selectedId === d.id ? "bg-zinc-800" : ""}`}>
                          <td className="py-5 font-mono">{d.id}</td>
                          <td className="py-5">
                            {d.client ? `${d.client.prenom} ${d.client.nom}` : "—"}
                          </td>
                          <td className="py-5">{d.type}</td>
                          <td className="py-5 font-bold">{d.montant.toLocaleString('fr-FR')} €</td>
                          <td className="py-5 text-zinc-400">{d.date}</td>
                          <td className="py-5">
                            <Badge className={d.statut === "Accepté" ? "bg-emerald-600" : d.statut === "En cours" ? "bg-amber-600" : "bg-red-600"}>
                              {d.statut}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau Détails */}
          <div className="lg:col-span-5">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-8">
              <CardHeader>
                <CardTitle>Détails de la demande</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {selectedDemande ? (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4">Informations Client</h3>
                      {selectedDemande.client ? (
                        <div className="space-y-3 bg-zinc-950 p-6 rounded-3xl">
                          <p><strong>Nom :</strong> {selectedDemande.client.prenom} {selectedDemande.client.nom}</p>
                          <p><strong>Téléphone :</strong> {selectedDemande.client.telephone}</p>
                          <p><strong>Email :</strong> {selectedDemande.client.email}</p>
                          <p><strong>Adresse :</strong> {selectedDemande.client.adresse}, {selectedDemande.client.ville}, {selectedDemande.client.pays}</p>
                          <p><strong>Type :</strong> {selectedDemande.client.typeClient}</p>
                        </div>
                      ) : (
                        <p className="text-zinc-400">Aucune information client disponible</p>
                      )}
                    </div>

                    {/* Mise à jour du statut */}
                    <div>
                      <label className="block text-sm mb-3 text-zinc-400">Nouveau statut</label>
                      <Select onValueChange={(v: any) => setNewStatut(v)} value={newStatut}>
                        <SelectTrigger className="h-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En cours">⏳ En cours</SelectItem>
                          <SelectItem value="Accepté">✅ Accepté</SelectItem>
                          <SelectItem value="Refusé">❌ Refusé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-3 text-zinc-400">Commentaire</label>
                      <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-3xl p-5" placeholder="Message pour le client..." />
                    </div>

                    <Button onClick={updateStatut} disabled={isUpdating} className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700">
                      {isUpdating ? "Mise à jour..." : "Enregistrer le changement"}
                    </Button>
                  </>
                ) : (
                  <p className="text-zinc-400 text-center py-12">Sélectionnez une demande pour voir les détails</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}