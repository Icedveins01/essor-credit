"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import worldCountries from "world-countries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "../components/Header";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Car,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileCheck2,
  Home,
  Landmark,
  Lock,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

type Step = "simulateur" | "form" | "confirmation" | "success";
type ClientType = "particulier" | "independant";
type Sexe = "Homme" | "Femme" | "Autre";

const loanTypes = [
  { name: "Prêt Immobilier", icon: Home, desc: "Achat, construction, rénovation" },
  { name: "Rachat de Crédits", icon: RefreshCw, desc: "Regroupement et mensualité unique" },
  { name: "Prêt Personnel", icon: User, desc: "Projet personnel ou trésorerie" },
  { name: "Prêt Auto", icon: Car, desc: "Véhicule neuf ou occasion" },
  { name: "Crédit à la Consommation", icon: Wallet, desc: "Besoin ponctuel ou équipement" },
  { name: "Prêt Professionnel", icon: Briefcase, desc: "Indépendants et entreprises" },
];

function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const countries = worldCountries
  .map((country) => {
    const root = country.idd?.root || "";
    const suffixes = country.idd?.suffixes || [];
    const code = root && suffixes.length === 1 ? `${root}${suffixes[0]}` : root;

    return {
      name: country.translations?.fra?.common || country.name.common,
      englishName: country.name.common,
      code,
      flag: country.flag || flagEmoji(country.cca2),
      cca2: country.cca2,
    };
  })
  .filter((country) => country.name && country.cca2)
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const phoneCountries = countries.filter((country) => country.code);

export default function FaireDemande() {
  const searchParams = useSearchParams();

  const typeFromUrl = searchParams.get("type") || "Prêt Personnel";
  const montantFromUrl = parseInt(searchParams.get("montant") || "150000");
  const dureeFromUrl = parseInt(searchParams.get("duree") || "180");

  const [step, setStep] = useState<Step>("simulateur");
  const [selectedType, setSelectedType] = useState(typeFromUrl);
  const [montant, setMontant] = useState(isNaN(montantFromUrl) ? 150000 : montantFromUrl);
  const [duree, setDuree] = useState(isNaN(dureeFromUrl) ? 180 : dureeFromUrl);
  const [typeClient, setTypeClient] = useState<ClientType>("particulier");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sexe: "" as Sexe | "",
    prenom: "",
    nom: "",
    indicatif: "+33",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "France",
    paysPret: "France",
    revenuOuCA: "",
    charges: "",
    message: "",
  });

  const TAUX_FIXE = 3.0;

  const mensualite = useMemo(() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  }, [montant, duree]);

  const coutTotal = duree >= 6 ? Math.round(mensualite * duree * 100) / 100 : 0;
  const interets = duree >= 6 ? Math.round((coutTotal - montant) * 100) / 100 : 0;

  const selectedLoan = loanTypes.find((item) => item.name === selectedType) || loanTypes[2];
  const currentStepIndex = ["simulateur", "form", "confirmation", "success"].indexOf(step);

  const requiredFields = [
    formData.sexe,
    formData.prenom.trim(),
    formData.nom.trim(),
    formData.email.trim(),
    formData.telephone.trim(),
    formData.adresse.trim(),
    formData.ville.trim(),
    formData.pays.trim(),
    formData.paysPret.trim(),
    formData.revenuOuCA.trim(),
    formData.charges.trim(),
  ];

  const isFormValid =
    requiredFields.every(Boolean) &&
    formData.email.includes("@") &&
    formData.telephone.trim().length >= 6;

  const missingFieldsCount = requiredFields.filter((field) => !field).length;

  const handleFinalSubmit = async () => {
    if (!isFormValid) {
      alert("Veuillez compléter tous les champs obligatoires avant de continuer.");
      setStep("form");
      return;
    }

    setIsSubmitting(true);

    const clientEmail = formData.email.toLowerCase().trim();
    const randomPassword = String(Math.floor(100000 + Math.random() * 900000));

    try {
      const response = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          montant,
          duree,
          mensualite,
          coutTotal,
          interets,
          typeClient,
          isIndependant: typeClient === "independant",
          message: formData.message,
          clientEmail,
          password: randomPassword,
          sexe: formData.sexe,
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          telephone: formData.indicatif + formData.telephone,
          indicatif: formData.indicatif,
          adresse: formData.adresse,
          ville: formData.ville,
          pays: formData.pays,
          paysPret: formData.paysPret,
          revenuOuCA: formData.revenuOuCA,
          charges: formData.charges,
        }),
      });

            const result = await response.json();

      if (result.success) {
        const accessCode =
          result.accessCode || randomPassword || "Code déjà existant";

        const clients = JSON.parse(localStorage.getItem("clients") || "[]");

        const existingClient = clients.find(
          (c: any) => c.email === clientEmail
        );

        if (!existingClient) {
          clients.push({
            email: clientEmail,
            password: accessCode,
            nom: formData.nom.trim(),
            prenom: formData.prenom.trim(),
            telephone: formData.indicatif + formData.telephone,
          });

          localStorage.setItem("clients", JSON.stringify(clients));
        }

        (window as any).tempPassword = accessCode;

        alert(
          `Votre demande a été enregistrée avec succès.\n\nEmail : ${clientEmail}\nCode d’accès client : ${accessCode}\n\nConservez ces informations pour accéder à votre espace client.`
        );

        setStep("success");
      } else {
        alert("Erreur : " + (result.error || "Inconnue"));
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SummaryCard = () => (
    <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden sticky top-28">
      <CardContent className="p-7">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <p className="text-zinc-400 text-sm">Résumé de la simulation</p>
            <p className="text-3xl font-bold text-white mt-2">
              {montant.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-zinc-400">Type</span>
            <span className="text-right font-medium">{selectedType}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-zinc-400">Durée</span>
            <span className="font-medium">{duree} mois</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-zinc-400">Mensualité</span>
            <span className="font-medium text-emerald-300">
              {mensualite.toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-zinc-400">Coût total</span>
            <span className="font-medium">{coutTotal.toLocaleString("fr-FR")} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Intérêts</span>
            <span className="font-medium text-amber-300">{interets.toLocaleString("fr-FR")} €</span>
          </div>
        </div>

        <div className="mt-7 bg-black/20 border border-white/10 rounded-3xl p-5">
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <Lock className="w-5 h-5 text-emerald-300" />
            Données transmises de manière sécurisée
          </div>
        </div>

        {step === "form" && missingFieldsCount > 0 && (
          <div className="mt-4 bg-amber-500/10 border border-amber-400/20 rounded-3xl p-4 text-sm text-amber-200">
            {missingFieldsCount} champ(s) obligatoire(s) à compléter.
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (step === "success") {
    return (
      <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
        <Header />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#10b98133,transparent_35%),radial-gradient(circle_at_bottom_right,#2563eb2e,transparent_42%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-10 md:p-14 text-center">
                <div className="mx-auto w-24 h-24 bg-emerald-500/20 border border-emerald-400/30 rounded-[2rem] flex items-center justify-center mb-8">
                  <CheckCircle className="w-14 h-14 text-emerald-300" />
                </div>

                <p className="text-emerald-300 font-medium mb-3">Demande enregistrée</p>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Votre dossier a bien été transmis
                </h1>
                <p className="text-zinc-400 mt-5 text-lg">
                  Votre espace client a été créé automatiquement. Vous pouvez suivre l’avancement de votre demande et transmettre vos documents depuis votre tableau de bord.
                </p>

                <div className="bg-black/25 border border-white/10 rounded-3xl p-6 text-left mt-10 space-y-4">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    Identifiants Espace Client
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/7 border border-white/10 rounded-2xl p-4">
                      <p className="text-zinc-500">Email</p>
                      <p className="font-medium mt-1 break-all">{formData.email}</p>
                    </div>
                    <div className="bg-white/7 border border-white/10 rounded-2xl p-4">
                      <p className="text-zinc-500">Mot de passe</p>
                      <p className="font-mono text-emerald-300 font-bold mt-1">
                        {(window as any).tempPassword}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
  onClick={() => {
    window.location.href = "/espace-client";
  }}
  className="w-full h-16 mt-8 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
>
  Accéder à mon Espace Client
  <ArrowRight className="ml-2 w-5 h-5" />
</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <Header />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98124,transparent_34%),radial-gradient(circle_at_bottom_right,#2563eb24,transparent_40%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2 text-sm text-zinc-300 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Demande de financement sécurisée
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Préparez votre dossier en quelques étapes
            </h1>
            <p className="text-zinc-400 mt-4 text-lg max-w-3xl">
              Simulation, informations personnelles, confirmation et création automatique de votre espace client.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { key: "simulateur", title: "Simulation", icon: Banknote },
            { key: "form", title: "Informations", icon: User },
            { key: "confirmation", title: "Confirmation", icon: FileCheck2 },
          ].map((item, index) => {
            const Icon = item.icon;
            const active = step === item.key;
            const completed = currentStepIndex > index;

            return (
              <div
                key={item.key}
                className={`rounded-3xl border p-5 flex items-center gap-4 transition ${
                  active
                    ? "bg-emerald-500/15 border-emerald-400/40"
                    : completed
                    ? "bg-white/10 border-white/10"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    active || completed
                      ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                      : "bg-white/5 border-white/10 text-zinc-500"
                  }`}
                >
                  {completed ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Étape {index + 1}</p>
                  <p className="font-semibold">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === "simulateur" && (
                <motion.div key="simulateur" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
                  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/10">
                      <CardTitle className="text-3xl text-white flex items-center gap-3">
                        <Landmark className="w-7 h-7 text-emerald-300" />
                        Votre simulation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div>
                        <Label className="text-zinc-300 mb-4 block">Type de financement</Label>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {loanTypes.map((item) => {
                            const Icon = item.icon;
                            const active = selectedType === item.name;

                            return (
                              <button
                                key={item.name}
                                onClick={() => setSelectedType(item.name)}
                                className={`rounded-3xl p-5 text-left border transition-all ${
                                  active
                                    ? "bg-emerald-500/20 border-emerald-400/40"
                                    : "bg-black/20 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <Icon className="w-8 h-8 text-emerald-300 mb-5" />
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-zinc-500 mt-2">{item.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                          <Label className="text-zinc-400">Montant du prêt</Label>
                          <Input
                            type="number"
                            value={montant}
                            onChange={(e) => setMontant(Math.max(0, Math.min(2000000, Number(e.target.value) || 0)))}
                            className="mt-4 h-14 bg-white/10 border-white/10 text-white text-2xl font-semibold rounded-2xl"
                          />
                          <input
                            type="range"
                            min={1000}
                            max={2000000}
                            step={1000}
                            value={montant}
                            onChange={(e) => setMontant(Number(e.target.value))}
                            className="w-full accent-emerald-400 mt-5"
                          />
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                          <Label className="text-zinc-400">Durée du prêt</Label>
                          <Input
                            type="number"
                            value={duree}
                            onChange={(e) => setDuree(Math.max(6, Math.min(360, Number(e.target.value) || 6)))}
                            className="mt-4 h-14 bg-white/10 border-white/10 text-white text-2xl font-semibold rounded-2xl"
                          />
                          <input
                            type="range"
                            min={6}
                            max={360}
                            step={6}
                            value={duree}
                            onChange={(e) => setDuree(Number(e.target.value))}
                            className="w-full accent-emerald-400 mt-5"
                          />
                          <p className="text-sm text-zinc-400 mt-3">
                            {Math.floor(duree / 12)} ans {duree % 12} mois
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setStep("form")} className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600">
                          Continuer
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === "form" && (
                <motion.div key="form" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
                  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/10">
                      <CardTitle className="text-3xl text-white flex items-center gap-3">
                        <User className="w-7 h-7 text-emerald-300" />
                        Informations du demandeur
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div>
                        <Label className="text-zinc-300 mb-4 block">Profil *</Label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { key: "particulier", label: "Particulier", icon: User },
                            { key: "independant", label: "Indépendant / Professionnel", icon: Briefcase },
                          ].map((item) => {
                            const Icon = item.icon;
                            const active = typeClient === item.key;
                            return (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => setTypeClient(item.key as ClientType)}
                                className={`rounded-3xl border p-5 flex items-center gap-4 transition ${
                                  active
                                    ? "bg-emerald-500/20 border-emerald-400/40"
                                    : "bg-black/20 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <Icon className="w-7 h-7 text-emerald-300" />
                                <span className="font-semibold">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <Label>Sexe *</Label>
                          <select
                            value={formData.sexe}
                            onChange={(e) => setFormData({ ...formData, sexe: e.target.value as Sexe })}
                            className="h-14 w-full bg-white/10 border border-white/10 text-white rounded-2xl px-4 outline-none"
                          >
                            <option value="" className="text-black">Sélectionner</option>
                            <option value="Homme" className="text-black">Homme</option>
                            <option value="Femme" className="text-black">Femme</option>
                            <option value="Autre" className="text-black">Autre / Non précisé</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Prénom *</Label>
                          <Input
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nom *</Label>
                          <Input
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>Téléphone *</Label>
                          <div className="flex gap-3">
                            <select
                              value={formData.indicatif}
                              onChange={(e) => setFormData({ ...formData, indicatif: e.target.value })}
                              className="h-14 max-w-[170px] bg-white/10 border border-white/10 text-white rounded-2xl px-4 outline-none"
                            >
                              {phoneCountries.map((c) => (
                                <option key={`${c.cca2}-${c.code}`} value={c.code} className="text-black">
                                  {c.flag} {c.name} ({c.code})
                                </option>
                              ))}
                            </select>
                            <Input
                              value={formData.telephone}
                              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                              type="tel"
                              className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                            <Input
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              type="email"
                              className="h-14 bg-white/10 border-white/10 text-white rounded-2xl pl-12"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>Pays de résidence *</Label>
                          <select
                            value={formData.pays}
                            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                            className="h-14 w-full bg-white/10 border border-white/10 text-white rounded-2xl px-4 outline-none"
                          >
                            {countries.map((c) => (
                              <option key={c.cca2} value={c.name} className="text-black">
                                {c.flag} {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Pays du prêt *</Label>
                          <select
                            value={formData.paysPret}
                            onChange={(e) => setFormData({ ...formData, paysPret: e.target.value })}
                            className="h-14 w-full bg-white/10 border border-white/10 text-white rounded-2xl px-4 outline-none"
                          >
                            {countries.map((c) => (
                              <option key={`pret-${c.cca2}`} value={c.name} className="text-black">
                                {c.flag} {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>Adresse *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                            <Input
                              value={formData.adresse}
                              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                              className="h-14 bg-white/10 border-white/10 text-white rounded-2xl pl-12"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Ville *</Label>
                          <Input
                            value={formData.ville}
                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                            className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label>{typeClient === "particulier" ? "Revenu net mensuel (€) *" : "Chiffre d’affaires mensuel (€) *"}</Label>
                          <Input
                            value={formData.revenuOuCA}
                            onChange={(e) => setFormData({ ...formData, revenuOuCA: e.target.value })}
                            type="number"
                            className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{typeClient === "particulier" ? "Charges mensuelles (€) *" : "Charges professionnelles (€) *"}</Label>
                          <Input
                            value={formData.charges}
                            onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                            type="number"
                            className="h-14 bg-white/10 border-white/10 text-white rounded-2xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Message / détails complémentaires</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          placeholder="Décrivez votre projet ou votre situation..."
                          className="bg-white/10 border-white/10 text-white rounded-2xl placeholder:text-zinc-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setStep("simulateur")}
                          className="h-14 px-8 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10"
                        >
                          <ArrowLeft className="mr-2 w-5 h-5" />
                          Retour
                        </Button>
                        <Button
                          onClick={() => {
                            if (!isFormValid) {
                              alert("Veuillez compléter tous les champs obligatoires.");
                              return;
                            }
                            setStep("confirmation");
                          }}
                          className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600"
                        >
                          Vérifier ma demande
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === "confirmation" && (
                <motion.div key="confirmation" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
                  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/10">
                      <CardTitle className="text-3xl text-white flex items-center gap-3">
                        <BadgeCheck className="w-7 h-7 text-emerald-300" />
                        Vérification finale
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6 space-y-3">
                          <p className="font-semibold text-lg mb-4">Financement</p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Type</span><span>{selectedType}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Montant</span><span>{montant.toLocaleString("fr-FR")} €</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Durée</span><span>{duree} mois</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Mensualité</span><span className="text-emerald-300">{mensualite.toLocaleString("fr-FR")} €</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Pays du prêt</span><span>{formData.paysPret}</span></p>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6 space-y-3">
                          <p className="font-semibold text-lg mb-4">Demandeur</p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Sexe</span><span>{formData.sexe}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Nom</span><span>{formData.prenom} {formData.nom}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Email</span><span className="break-all text-right">{formData.email}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Téléphone</span><span>{formData.indicatif} {formData.telephone}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Pays</span><span>{formData.pays}</span></p>
                          <p className="flex justify-between gap-4"><span className="text-zinc-400">Profil</span><span>{typeClient === "particulier" ? "Particulier" : "Indépendant"}</span></p>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-3xl p-5 flex gap-4 text-sm text-zinc-300">
                        <ShieldCheck className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                        <p>
                          Après confirmation, votre demande sera enregistrée et un espace client sécurisé sera créé pour suivre l’avancement du dossier.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setStep("form")}
                          className="h-14 px-8 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10"
                        >
                          <ArrowLeft className="mr-2 w-5 h-5" />
                          Modifier
                        </Button>
                        <Button
                          onClick={handleFinalSubmit}
                          disabled={isSubmitting}
                          className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600"
                        >
                          {isSubmitting ? "Envoi en cours..." : "Confirmer et envoyer"}
                          {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <SummaryCard />

            <Card className="bg-white/7 border-white/10 rounded-[2rem]">
              <CardContent className="p-7">
                <p className="font-semibold flex items-center gap-2 mb-5">
                  {(() => {
                    const Icon = selectedLoan.icon;
                    return <Icon className="w-5 h-5 text-emerald-300" />;
                  })()}
                  {selectedLoan.name}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {selectedLoan.desc}. Votre demande sera analysée selon les informations transmises et les pièces éventuelles demandées depuis l’espace client.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}