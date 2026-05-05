"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, RefreshCw, User, Car, Wallet, Briefcase,
  Phone, Mail, MapPin, CheckCircle
} from "lucide-react";

const countries = [
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Belgique", code: "+32", flag: "🇧🇪" },
  { name: "Allemagne", code: "+49", flag: "🇩🇪" },
  { name: "Suisse", code: "+41", flag: "🇨🇭" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Autriche", code: "+43", flag: "🇦🇹" },
  { name: "Italie", code: "+39", flag: "🇮🇹" },
  { name: "Espagne", code: "+34", flag: "🇪🇸" },
  { name: "Autre", code: "", flag: "🌍" },
];

export default function FaireDemande() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type") || "Prêt Personnel";
  const montantFromUrl = parseInt(searchParams.get("montant") || "150000");
  const dureeFromUrl = parseInt(searchParams.get("duree") || "180");

  const [step, setStep] = useState<"simulateur" | "form" | "confirmation" | "success">("simulateur");
  const [selectedType, setSelectedType] = useState(typeFromUrl);
  const [montant, setMontant] = useState(isNaN(montantFromUrl) ? 150000 : montantFromUrl);
  const [duree, setDuree] = useState(isNaN(dureeFromUrl) ? 180 : dureeFromUrl);
  const [typeClient, setTypeClient] = useState<"particulier" | "independant">("particulier");

  const [formData, setFormData] = useState({
    prenom: "", nom: "", indicatif: "+33", telephone: "", email: "",
    adresse: "", ville: "", pays: "France", revenuOuCA: "", charges: "", message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const TAUX_FIXE = 3.0;
  const mensualite = (() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  })();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const clientEmail = formData.email.toLowerCase().trim();
    const randomPassword = String(Math.floor(100000 + Math.random() * 900000));

    const nouvelleDemande = {
      id: `D-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`,
      date: new Date().toLocaleDateString('fr-FR'),
      type: selectedType,
      montant: montant,
      statut: "En cours" as const,
      isIndependant: typeClient === "independant",
      signedContract: undefined,
      justificatifs: [],
      client: {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: clientEmail,
        telephone: formData.indicatif + formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        pays: formData.pays,
        typeClient: typeClient,
        revenuOuCA: formData.revenuOuCA,
        charges: formData.charges,
        message: formData.message,
      }
    };

    const existing = JSON.parse(localStorage.getItem("demandes") || "[]");
    localStorage.setItem("demandes", JSON.stringify([nouvelleDemande, ...existing]));

    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    if (!clients.find((c: any) => c.email === clientEmail)) {
      clients.push({
        email: clientEmail,
        password: randomPassword,
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        telephone: formData.indicatif + formData.telephone,
      });
      localStorage.setItem("clients", JSON.stringify(clients));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
      (window as any).tempPassword = randomPassword;
    }, 1000);
  };

  if (step === "success") {
    return (
      <main className="min-h-screen bg-zinc-50 pt-24 pb-20 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg text-center">
          <div className="mx-auto w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mb-10">
            <CheckCircle className="w-20 h-20 text-emerald-600" />
          </div>
          <h2 className="text-5xl font-bold text-emerald-700 mb-6">Demande envoyée avec succès !</h2>
          <p className="text-xl text-zinc-600 mb-10">Un conseiller vous contactera dans les 24 heures.</p>

          <Card className="shadow-2xl p-8 mb-10 bg-white">
            <p className="font-semibold text-lg mb-6">Vos identifiants Espace Client :</p>
            <div className="bg-zinc-100 rounded-2xl p-6 text-left space-y-4 text-base">
              <div><strong>Email :</strong> {formData.email}</div>
              <div><strong>Mot de passe :</strong> <span className="font-mono bg-white px-4 py-1 rounded text-emerald-600 font-bold">{(window as any).tempPassword}</span></div>
            </div>
          </Card>

          <Button 
            onClick={() => window.location.href = "/espace-client"}
            className="w-full py-8 text-xl font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl"
          >
            Accéder à mon Espace Client →
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-20 pb-12">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-bold text-center tracking-tighter mb-6">
          Votre Demande de Financement
        </motion.h1>

        {/* Progress Bar */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-3xl shadow-xl border px-6 sm:px-12 py-4 sm:py-5 gap-6 sm:gap-12 overflow-x-auto">
            {["Simulation", "Informations", "Confirmation"].map((label, i) => (
              <div key={i} className={`flex items-center gap-3 sm:gap-4 whitespace-nowrap ${["simulateur","form","confirmation"][i] === step ? "text-emerald-700" : "text-zinc-400"}`}>
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold border-2 flex-shrink-0 ${["simulateur","form","confirmation"][i] === step ? "border-emerald-600 bg-emerald-50" : "border-zinc-200"}`}>
                  {i + 1}
                </div>
                <span className="font-semibold text-sm sm:text-base">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* SIMULATEUR */}
          {step === "simulateur" && (
            <motion.div key="simulateur" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-zinc-950 to-black text-white py-10 sm:py-16">
                  <CardTitle className="text-3xl sm:text-4xl text-center">Votre Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-12 space-y-10">
                  {/* Type de prêt + Montant + Durée (ton code existant) */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Type de prêt</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: "Prêt Immobilier", icon: Home },
                        { name: "Rachat de Crédits", icon: RefreshCw },
                        { name: "Prêt Personnel", icon: User },
                        { name: "Prêt Auto", icon: Car },
                        { name: "Crédit à la Consommation", icon: Wallet },
                        { name: "Prêt Professionnel", icon: Briefcase },
                      ].map((item) => (
                        <motion.button
                          key={item.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedType(item.name)}
                          className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 ${selectedType === item.name ? "border-emerald-600 bg-emerald-50" : "border-zinc-200 hover:border-zinc-300"}`}
                        >
                          <item.icon className={`w-12 h-12 ${selectedType === item.name ? "text-emerald-600" : "text-zinc-400"}`} />
                          <span className="font-semibold text-center">{item.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Montant du prêt (€)</Label>
                      <Input type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="text-4xl h-20 text-center font-semibold rounded-3xl" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Durée (mois)</Label>
                      <Input type="number" value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="text-4xl h-20 text-center font-semibold rounded-3xl" />
                    </div>
                  </div>

                  <Button onClick={() => setStep("form")} className="w-full py-8 text-xl font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl">
                    Continuer avec cette simulation →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ===================== FORMULAIRE ===================== */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-10 sm:py-14">
                  <CardTitle className="text-3xl sm:text-4xl text-center">Complétez votre demande</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-14 space-y-10">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">Vous êtes :</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button type="button" onClick={() => setTypeClient("particulier")} className={`py-8 text-base font-medium ${typeClient === "particulier" ? "bg-emerald-600 text-white shadow" : "border-2 border-zinc-200 hover:bg-zinc-50"}`}>Particulier</Button>
                      <Button type="button" onClick={() => setTypeClient("independant")} className={`py-8 text-base font-medium ${typeClient === "independant" ? "bg-emerald-600 text-white shadow" : "border-2 border-zinc-200 hover:bg-zinc-50"}`}>Indépendant</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative space-y-2">
                      <Label>Prénom *</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 text-zinc-400" />
                        <Input value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required className="pl-12 h-14 text-base rounded-2xl" />
                      </div>
                    </div>
                    <div className="relative space-y-2">
                      <Label>Nom *</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 text-zinc-400" />
                        <Input value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required className="pl-12 h-14 text-base rounded-2xl" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Téléphone *</Label>
                      <div className="flex gap-3">
                        <select value={formData.indicatif} onChange={(e) => setFormData({...formData, indicatif: e.target.value})} className="h-14 border border-zinc-200 rounded-2xl px-4 text-base">
                          {countries.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
                          ))}
                        </select>
                        <Input value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} type="tel" required className="h-14 text-base rounded-2xl flex-1" />
                      </div>
                    </div>
                    <div className="relative space-y-2">
                      <Label>Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 text-zinc-400" />
                        <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" required className="pl-12 h-14 text-base rounded-2xl" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative space-y-2 sm:col-span-1">
                      <Label>Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-zinc-400" />
                        <Input value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="pl-12 h-14 text-base rounded-2xl" />
                      </div>
                    </div>
                    <div className="space-y-2"><Label>Ville</Label><Input value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} className="h-14 text-base rounded-2xl" /></div>
                    <div className="space-y-2"><Label>Pays</Label>
                      <select value={formData.pays} onChange={(e) => setFormData({...formData, pays: e.target.value})} className="h-14 w-full border border-zinc-200 rounded-2xl px-4 text-base">
                        {countries.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {typeClient === "particulier" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2"><Label>Revenu net mensuel (€)</Label><Input value={formData.revenuOuCA} onChange={(e) => setFormData({...formData, revenuOuCA: e.target.value})} type="number" className="h-14 text-base rounded-2xl" /></div>
                      <div className="space-y-2"><Label>Charges mensuelles (€)</Label><Input value={formData.charges} onChange={(e) => setFormData({...formData, charges: e.target.value})} type="number" className="h-14 text-base rounded-2xl" /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2"><Label>Chiffre d'affaires mensuel (€)</Label><Input value={formData.revenuOuCA} onChange={(e) => setFormData({...formData, revenuOuCA: e.target.value})} type="number" className="h-14 text-base rounded-2xl" /></div>
                      <div className="space-y-2"><Label>Charges professionnelles (€)</Label><Input value={formData.charges} onChange={(e) => setFormData({...formData, charges: e.target.value})} type="number" className="h-14 text-base rounded-2xl" /></div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Message / Détails (optionnel)</Label>
                    <Textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5} placeholder="Décrivez votre situation ou votre projet..." className="rounded-2xl text-base" />
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button type="button" onClick={() => setStep("confirmation")} className="w-full py-7 sm:py-8 text-lg sm:text-xl font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl btn-premium">
                      Vérifier et confirmer ma demande
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ===================== CONFIRMATION ===================== */}
          {step === "confirmation" && (
            <motion.div key="confirmation" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-3xl sm:text-4xl text-center">Vérification finale</CardTitle>
                </CardHeader>
                <CardContent className="p-8 sm:p-12">
                  <div className="bg-zinc-50 rounded-3xl p-8 sm:p-10 space-y-6 text-base sm:text-lg">
                    <h3 className="font-semibold text-xl mb-4">Informations du prêt</h3>
                    <p><strong>Type :</strong> {selectedType}</p>
                    <p><strong>Montant :</strong> {montant.toLocaleString('fr-FR')} €</p>
                    <p><strong>Durée :</strong> {Math.floor(duree / 12)} ans {duree % 12} mois</p>
                    <p><strong>Mensualité estimée :</strong> <span className="text-emerald-600 font-semibold">{mensualite.toLocaleString('fr-FR')} € / mois</span></p>

                    <h3 className="font-semibold text-xl mt-8 mb-4">Informations personnelles</h3>
                    <p><strong>Nom complet :</strong> {formData.prenom} {formData.nom}</p>
                    <p><strong>Téléphone :</strong> {formData.indicatif} {formData.telephone}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Adresse :</strong> {formData.adresse}, {formData.ville}, {formData.pays}</p>
                    <p><strong>Profil :</strong> {typeClient === "particulier" ? "Particulier" : "Indépendant"}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-12">
                    <Button variant="outline" onClick={() => setStep("form")} className="flex-1 py-7 sm:py-8">Modifier</Button>
                    <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="flex-1 py-7 sm:py-8 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl btn-premium">
                      {isSubmitting ? "Envoi en cours..." : "Confirmer et envoyer la demande"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}