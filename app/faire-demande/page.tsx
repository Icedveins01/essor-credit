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
  Phone, Mail, MapPin
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

  const [step, setStep] = useState<"simulateur" | "form" | "confirmation">("simulateur");
  const [selectedType, setSelectedType] = useState(typeFromUrl);
  const [montant, setMontant] = useState(isNaN(montantFromUrl) ? 150000 : montantFromUrl);
  const [duree, setDuree] = useState(isNaN(dureeFromUrl) ? 180 : dureeFromUrl);
  const [typeClient, setTypeClient] = useState<"particulier" | "independant">("particulier");

  const [formData, setFormData] = useState({
    prenom: "", nom: "", indicatif: "+33", telephone: "", email: "",
    adresse: "", ville: "", pays: "France", revenuOuCA: "", charges: "", message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const TAUX_FIXE = 3.0;
  const mensualite = (() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  })();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const fullPhone = formData.indicatif + formData.telephone;
    const data = {
      ...formData,
      telephone: fullPhone,
      typeClient,
      service: selectedType,
      montantSouhaite: montant,
      duree,
      mensualite
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      alert("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-zinc-50 pt-20">
        <Header />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
          <motion.div animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.8 }} className="mb-12">
            <div className="w-40 h-40 sm:w-52 sm:h-52 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 sm:w-32 sm:h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl sm:text-6xl font-bold tracking-tighter text-emerald-700 px-4">
            Demande envoyée avec succès !
          </motion.h2>
          <p className="text-lg sm:text-2xl text-zinc-600 mt-6 max-w-lg px-4">Un conseiller expert vous contactera dans les 24 heures.</p>
          <Button onClick={() => window.location.href = "/"} className="mt-12 px-10 py-7 text-lg">Retour à l'accueil</Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-20 pb-12">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl sm:text-5xl font-bold text-center tracking-tighter mb-6"
        >
          Votre Demande de Financement
        </motion.h1>

        {/* Progress Bar Responsive */}
        <div className="flex justify-center mb-12">
          <motion.div className="inline-flex bg-white rounded-3xl shadow-xl border px-6 sm:px-12 py-4 sm:py-5 gap-6 sm:gap-12 overflow-x-auto">
            {["Simulation", "Informations", "Confirmation"].map((label, i) => (
              <motion.div 
                key={i} 
                className={`flex items-center gap-3 sm:gap-4 whitespace-nowrap ${step === ["simulateur","form","confirmation"][i] ? "text-emerald-700" : "text-zinc-400"}`} 
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold border-2 flex-shrink-0 ${step === ["simulateur","form","confirmation"][i] ? "border-emerald-600 bg-emerald-50" : "border-zinc-200"}`}
                  whileHover={{ rotate: 12 }}
                >
                  {i + 1}
                </motion.div>
                <span className="font-semibold text-sm sm:text-base">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {/* ===================== SIMULATEUR ===================== */}
          {step === "simulateur" && (
            <motion.div key="simulateur" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-zinc-950 to-black text-white py-10 sm:py-16">
                  <CardTitle className="text-3xl sm:text-4xl text-center">Votre Simulation</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-12 space-y-10">
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
                      ].map((item, idx) => (
                        <motion.button
                          key={item.name}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedType(item.name)}
                          className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                            selectedType === item.name ? "border-emerald-600 bg-emerald-50 shadow-xl" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <item.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${selectedType === item.name ? "text-emerald-600" : "text-zinc-400"}`} />
                          <span className="font-semibold text-center text-sm sm:text-base">{item.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Montant du prêt (€)</Label>
                      <Input 
                        type="number" 
                        value={montant} 
                        onChange={(e) => setMontant(Number(e.target.value))} 
                        className="text-4xl sm:text-5xl h-20 sm:h-24 text-center font-semibold border-2 rounded-3xl" 
                      />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Durée du prêt (mois)</Label>
                      <Input 
                        type="number" 
                        value={duree} 
                        onChange={(e) => setDuree(Number(e.target.value))} 
                        className="text-4xl sm:text-5xl h-20 sm:h-24 text-center font-semibold border-2 rounded-3xl" 
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      onClick={() => setStep("form")} 
                      className="w-full py-7 sm:py-8 text-lg sm:text-xl font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl btn-premium"
                    >
                      Continuer avec cette simulation →
                    </Button>
                  </motion.div>
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
                    {typeClient === "particulier" ? (
                      <p><strong>Revenu net mensuel :</strong> {formData.revenuOuCA} €</p>
                    ) : (
                      <p><strong>Chiffre d'affaires :</strong> {formData.revenuOuCA} €</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-12">
                    <Button variant="outline" onClick={() => setStep("form")} className="flex-1 py-7 sm:py-8 text-base">Modifier</Button>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                      <Button onClick={handleFinalSubmit} disabled={isSubmitting} className="w-full py-7 sm:py-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl btn-premium">
                        {isSubmitting ? "Envoi en cours..." : "Confirmer et envoyer la demande"}
                      </Button>
                    </motion.div>
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