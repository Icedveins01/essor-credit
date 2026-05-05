"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, ArrowRight, FileText, Upload, User, Download } from "lucide-react";
import Header from "../components/Header";

type Demande = {
  id: string;
  date: string;
  type: string;
  montant: number;
  statut: "En cours" | "Accepté" | "Refusé";
  commentaire?: string;
  progression?: number;
  isIndependant: boolean;           // ← Important pour documents adaptés
  documentsUploaded?: string[];
};

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const PASSWORD_CORRECT = "1234";

  useEffect(() => {
    const saved = localStorage.getItem("demandes");
    if (saved) {
      setDemandes(JSON.parse(saved));
    } else {
      const demo: Demande[] = [
        { id: "D-20260428-001", date: "28/04/2026", type: "Crédit Immobilier", montant: 285000, statut: "Accepté", commentaire: "Dossier validé", progression: 100, isIndependant: false },
        { id: "D-20260429-002", date: "29/04/2026", type: "Prêt Personnel", montant: 45000, statut: "En cours", commentaire: "Analyse en cours", progression: 65, isIndependant: false },
        { id: "D-20260430-003", date: "30/04/2026", type: "Rachat de Crédit", montant: 98000, statut: "En cours", commentaire: "En attente documents", progression: 40, isIndependant: true },
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

  const openContract = (demande: Demande) => {
    setSelectedDemande(demande);
    setShowContractModal(true);
  };

  const openUpload = (demande: Demande) => {
    setSelectedDemande(demande);
    setShowUploadModal(true);
  };

  // Documents demandés selon le profil
  const getRequiredDocuments = (isIndependant: boolean) => {
    if (isIndependant) {
      return [
        "Pièce d'identité (CNI ou Passeport)",
        "Avis d'imposition N-1 et N-2",
        "Relevés bancaires des 6 derniers mois",
        "Bilan comptable ou déclaration URSSAF",
        "Justificatif de domicile",
        "Attestation de chiffre d'affaires"
      ];
    }
    return [
      "Pièce d'identité (CNI ou Passeport)",
      "Fiches de paie des 3 derniers mois",
      "Avis d'imposition N-1",
      "Relevés bancaires des 3 derniers mois",
      "Justificatif de domicile",
      "Contrat de travail ou CDI"
    ];
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Bonjour,</h1>
            <p className="text-2xl text-emerald-400">Bienvenue dans votre espace personnel</p>
          </div>
          <Button onClick={() => window.location.href = "/faire-demande"} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-7 rounded-3xl text-lg">
            Nouvelle Demande <ArrowRight className="ml-3" />
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-400">Dossiers en cours</p>
            <p className="text-5xl font-bold mt-3">{demandes.filter(d => d.statut === "En cours").length}</p>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-400">Montant total</p>
            <p className="text-5xl font-bold mt-3 text-emerald-400">
              {demandes.reduce((sum, d) => sum + d.montant, 0).toLocaleString('fr-FR')} €
            </p>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-400">Acceptés</p>
            <p className="text-5xl font-bold mt-3 text-emerald-500">{demandes.filter(d => d.statut === "Accepté").length}</p>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800 p-8">
            <p className="text-zinc-400">Dernière activité</p>
            <p className="text-xl font-semibold mt-3">Il y a 2 heures</p>
          </Card>
        </div>

        {/* Mes demandes */}
        <h2 className="text-3xl font-bold mb-8">Mes demandes en cours</h2>
        <div className="space-y-6">
          {demandes.map((d) => {
            const status = d.statut === "Accepté" ? { color: "bg-emerald-500", label: "Accepté" } :
                          d.statut === "En cours" ? { color: "bg-amber-500", label: "En cours" } :
                          { color: "bg-red-500", label: "Refusé" };

            return (
              <Card key={d.id} className="bg-zinc-900 border border-zinc-800 hover:border-emerald-600/50 transition-all">
                <CardContent className="p-8 flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-sm text-zinc-500">{d.id}</span>
                      <span className="text-2xl font-semibold">{d.type}</span>
                    </div>
                    <p className="text-5xl font-bold">{d.montant.toLocaleString('fr-FR')} €</p>
                    <p className="text-zinc-400 mt-1">Demandé le {d.date}</p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <Badge className={`${status.color} text-white px-6 py-2.5`}>
                      {status.label}
                    </Badge>

                    {d.statut === "Accepté" && (
                      <Button onClick={() => openContract(d)} className="bg-emerald-600 hover:bg-emerald-700">
                        Signer le contrat
                      </Button>
                    )}

                    {d.statut === "En cours" && (
                      <Button onClick={() => openUpload(d)} variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-950">
                        Envoyer mes documents
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Prochaines étapes globales */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Prochaines étapes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-emerald-600/30 p-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Signature du contrat</h3>
                  <p className="text-zinc-400 mt-2">Obligatoire pour tous les dossiers acceptés.</p>
                </div>
              </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 p-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Virement des fonds</h3>
                  <p className="text-emerald-400 font-medium">Prévu entre le 5 et le 10 mai 2026</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* MODAL CONTRAT */}
      <AnimatePresence>
        {showContractModal && selectedDemande && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 rounded-3xl max-w-2xl w-full p-10">
              <h2 className="text-3xl font-bold mb-6">Contrat de Prêt — {selectedDemande.type}</h2>
              <div className="bg-zinc-800 rounded-2xl p-8 h-[420px] overflow-auto text-zinc-300 leading-relaxed">
                <p>Contrat n° {selectedDemande.id}</p>
                <p className="mt-6">Montant emprunté : {selectedDemande.montant.toLocaleString('fr-FR')} €</p>
                <p>Taux fixe : 3,00 %</p>
                <p>Durée : 180 mois</p>
                <p className="mt-8">Le présent contrat est conclu entre Essor Crédit et le soussigné. Les fonds seront débloqués dans les 48h suivant la signature et la réception des documents justificatifs.</p>
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={() => setShowContractModal(false)} variant="outline" className="flex-1">Fermer</Button>
                <Button onClick={() => {
                  alert("Contrat signé électroniquement avec succès !");
                  setShowContractModal(false);
                }} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Signer le contrat
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}