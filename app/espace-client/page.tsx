"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, CheckCircle, LogOut, FileText } from "lucide-react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

type Demande = {
  id: string;
  date: string;
  type: string;
  montant: number;
  statut: "En cours" | "Accepté" | "Refusé";
  isIndependant?: boolean;
  signedContract?: string;
  justificatifs: string[];
  client?: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    typeClient?: string;
  };
};

type ClientAccount = {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
};

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(null);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signedInputRef = useRef<HTMLInputElement>(null);

  const login = () => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const found = clients.find((c: ClientAccount) =>
      c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (found) {
      setCurrentClient(found);
      setIsLoggedIn(true);

      const allDemandes = JSON.parse(localStorage.getItem("demandes") || "[]");
      const userDemandes = allDemandes.filter((d: Demande) =>
        d.client?.email?.toLowerCase() === email.toLowerCase()
      );
      setDemandes(userDemandes);
    } else {
      alert("Email ou mot de passe incorrect");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setCurrentClient(null);
  };

  const downloadContract = (id: string) => alert(`📄 Téléchargement du contrat ${id}.pdf lancé...`);

  const getRequiredDocuments = (isIndependant?: boolean) => {
    if (isIndependant) {
      return ["Avis d'imposition N-1 et N-2", "Liasse fiscale", "Relevés bancaires 3 mois", "Pièce d'identité", "Justificatif domicile", "Attestation URSSAF"];
    }
    return ["3 dernières fiches de paie", "Avis d'imposition N-1", "Relevés bancaires 3 mois", "Pièce d'identité", "Justificatif domicile"];
  };

  const handleFileUpload = (demandeId: string, type: "contract" | "justificatifs", files: FileList) => {
    setUploading(true);
    setTimeout(() => {
      setDemandes(prev => {
        const updated = prev.map(d => {
          if (d.id === demandeId) {
            if (type === "contract") return { ...d, signedContract: files[0].name };
            return { ...d, justificatifs: [...d.justificatifs, ...Array.from(files).map(f => f.name)] };
          }
          return d;
        });
        localStorage.setItem("demandes", JSON.stringify(updated));
        return updated;
      });
      setUploading(false);
      alert(`✅ ${files.length} document(s) uploadé(s) !`);
    }, 800);
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent, demandeId: string, type: "contract" | "justificatifs") => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files.length > 0) handleFileUpload(demandeId, type, e.dataTransfer.files);
  };

  const totalMontant = demandes.reduce((sum, d) => sum + d.montant, 0);
  const enCours = demandes.filter(d => d.statut === "En cours").length;
  const acceptes = demandes.filter(d => d.statut === "Accepté").length;

  // ===================== LOGIN SCREEN (Compact + Stars identiques à l'accueil) =====================
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0A1428] relative overflow-hidden flex items-center justify-center">
        {/* Fond étoiles identique à l'accueil */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <Stars radius={300} depth={60} count={1200} factor={4} saturation={0} fade speed={0.5} />
          </Canvas>
        </div>

        <Header />

        <div className="relative z-10 w-full max-w-[380px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl">
              <CardContent className="p-10 text-center space-y-8">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-xl">EC</div>
                </div>

                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Essor Crédit</h1>
                  <p className="text-emerald-400 text-xl mt-1">Espace Client</p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-white/10 h-14 text-base focus:border-emerald-500 placeholder:text-zinc-500"
                  />
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-white/10 h-14 text-base focus:border-emerald-500 placeholder:text-zinc-500"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    onClick={login}
                    className="w-full py-7 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-3xl shadow-xl btn-premium"
                  >
                    Se connecter
                  </Button>
                </motion.div>

                <p className="text-xs text-zinc-500">Mot de passe généré automatiquement lors de votre demande</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  // ===================== DASHBOARD (avec étoiles) =====================
  return (
    <main className="min-h-screen bg-[#0A1428] relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={400} depth={80} count={1500} factor={6} saturation={0} fade speed={0.7} />
        </Canvas>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-5">
              <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">👤</motion.div>
              <div>
                <p className="text-4xl font-bold">Bonjour {currentClient?.prenom}</p>
                <p className="text-zinc-400 text-lg">{currentClient?.nom}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="border-white/20 hover:bg-white/10">
              <LogOut className="mr-2 w-5 h-5" /> Déconnexion
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8">
              <p className="text-zinc-400">Dossiers en cours</p>
              <p className="text-7xl font-bold mt-3">{enCours}</p>
            </Card>
            <Card className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8">
              <p className="text-zinc-400">Montant total demandé</p>
              <p className="text-7xl font-bold mt-3">{totalMontant.toLocaleString('fr-FR')} €</p>
            </Card>
            <Card className="bg-emerald-600/10 border-emerald-500/30 p-8">
              <p className="text-emerald-400">Demandes acceptées</p>
              <p className="text-7xl font-bold mt-3 text-emerald-400">{acceptes}</p>
            </Card>
          </div>

          <h2 className="text-4xl font-semibold mb-10">Mes Demandes</h2>

          <div className="space-y-8">
            {demandes.map((d, index) => {
              const requiredDocs = getRequiredDocuments(d.isIndependant);
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 overflow-hidden">
                    <CardContent className="p-10">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <p className="font-mono text-sm text-zinc-500">{d.id}</p>
                            <p className="text-2xl font-semibold">{d.type}</p>
                          </div>
                          <p className="text-6xl font-bold mt-6">{d.montant.toLocaleString('fr-FR')} €</p>
                          <p className="text-zinc-400 mt-2">Demandé le {d.date}</p>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                          <Badge className={`px-8 py-2.5 text-base ${d.statut === "Accepté" ? "bg-emerald-600" : d.statut === "Refusé" ? "bg-red-600" : "bg-amber-600"}`}>
                            {d.statut}
                          </Badge>

                          {d.statut === "Accepté" && (
                            <>
                              <div className="w-full mt-6 pt-6 border-t border-zinc-700">
                                <p className="font-semibold mb-4 text-lg">Prochaines étapes</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <Card className="bg-zinc-950 border-zinc-700 p-6">
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">📄</div>
                                      <div>
                                        <p className="font-semibold">Signature du contrat</p>
                                        <p className="text-sm text-zinc-400 mt-1">Obligatoire pour débloquer les fonds</p>
                                        <Button onClick={() => downloadContract(d.id)} className="mt-4 w-full bg-white text-black">Télécharger le contrat</Button>
                                      </div>
                                    </div>
                                  </Card>

                                  <Card className="bg-zinc-950 border-zinc-700 p-6">
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">⏰</div>
                                      <div>
                                        <p className="font-semibold">Virement bancaire</p>
                                        <p className="text-sm text-emerald-400">Prévu le 05 mai 2026</p>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              </div>

                              <div className="w-full mt-8">
                                <p className="font-semibold mb-4">Documents attendus ({d.isIndependant ? "Indépendant" : "Particulier"})</p>
                                <div className="space-y-2 mb-6 text-sm">
                                  {requiredDocs.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 text-zinc-400">
                                      <FileText className="w-4 h-4" /> {doc}
                                    </div>
                                  ))}
                                </div>

                                <div
                                  className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${dragActive ? "border-emerald-600 bg-emerald-950/30" : "border-zinc-700 hover:border-zinc-600"}`}
                                  onDragEnter={handleDrag}
                                  onDragOver={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDrop={(e) => handleDrop(e, d.id, "justificatifs")}
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="mx-auto w-12 h-12 text-zinc-500 mb-4" />
                                  <p className="font-medium text-lg">Glissez-déposez vos documents ici</p>
                                  <p className="text-zinc-500 mt-1">ou cliquez pour sélectionner</p>
                                </div>

                                <Button onClick={() => signedInputRef.current?.click()} className="w-full mt-4" disabled={uploading}>
                                  <Upload className="mr-2" />
                                  {d.signedContract ? "Changer la version signée" : "Uploader version signée du contrat"}
                                </Button>

                                {d.signedContract && (
                                  <p className="text-emerald-400 text-sm mt-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Version signée : {d.signedContract}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && handleFileUpload(demandes.find(d => d.statut === "Accepté")?.id || "", "justificatifs", e.target.files)} />
      <input type="file" ref={signedInputRef} className="hidden" onChange={(e) => e.target.files && handleFileUpload(demandes.find(d => d.statut === "Accepté")?.id || "", "contract", e.target.files)} />
    </main>
  );
}