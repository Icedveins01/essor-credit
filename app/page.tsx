	"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "./components/Header";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  FileCheck2,
  Headphones,
  Home as HomeIcon,
  Landmark,
  Lock,
  MessageCircle,
  Phone,
  RefreshCw,
  Shield,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

type Service = {
  title: string;
  shortDesc: string;
  description: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    icon: <HomeIcon className="w-8 h-8" />,
    title: "Prêt Immobilier",
    shortDesc: "Achat, construction, rénovation",
    description:
      "Une solution structurée pour financer votre projet immobilier avec un accompagnement personnalisé.",
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Rachat de Crédits",
    shortDesc: "Regroupement et mensualité unique",
    description:
      "Simplifiez vos remboursements en regroupant plusieurs crédits dans une seule mensualité.",
  },
  {
    icon: <User className="w-8 h-8" />,
    title: "Prêt Personnel",
    shortDesc: "Projets personnels et trésorerie",
    description:
      "Un financement flexible pour concrétiser vos projets personnels selon votre situation.",
  },
  {
    icon: <Car className="w-8 h-8" />,
    title: "Prêt Auto",
    shortDesc: "Véhicule neuf ou occasion",
    description:
      "Financez l’achat d’un véhicule avec une solution claire, lisible et adaptée à votre budget.",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Crédit à la Consommation",
    shortDesc: "Besoin ponctuel ou projet rapide",
    description:
      "Une solution pour vos dépenses importantes, vos équipements ou vos besoins de financement.",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Prêt Professionnel",
    shortDesc: "Indépendants et entreprises",
    description:
      "Accompagnement des professionnels pour financer un lancement, une activité ou un développement.",
  },
];

const processSteps = [
  {
    icon: <FileCheck2 className="w-6 h-6" />,
    title: "Simulation",
    description: "Estimez votre mensualité et préparez votre projet en quelques secondes.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Analyse",
    description: "Votre demande est étudiée avec attention selon les informations transmises.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6" />,
    title: "Décision",
    description: "Vous suivez l’avancement de votre dossier depuis votre espace client sécurisé.",
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    title: "Finalisation",
    description: "Signature, documents et accompagnement jusqu’à la clôture du dossier.",
  },
];

const assurances = [
  "Simulation gratuite et sans engagement",
  "Espace client sécurisé",
  "Suivi du dossier en ligne",
  "Accompagnement humain",
];

export default function Page() {
  const [montant, setMontant] = useState<number>(150000);
  const [duree, setDuree] = useState<number>(180);
  const [selectedType, setSelectedType] = useState("Prêt Personnel");
  const [activeService, setActiveService] = useState(0);

  const TAUX_FIXE = 3.0;

  const mensualite = useMemo(() => {
    if (montant <= 0 || duree < 6) return 0;

    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m =
      (montant * tauxMensuel) /
      (1 - Math.pow(1 + tauxMensuel, -duree));

    return Math.round(m * 100) / 100;
  }, [montant, duree]);

  const coutTotal = duree >= 6 ? Math.round(mensualite * duree * 100) / 100 : 0;
  const interets = duree >= 6 ? Math.round((coutTotal - montant) * 100) / 100 : 0;

  const amortissement = useMemo(() => {
    const rows = [];
    let capitalRestant = montant;

    for (let i = 1; i <= 12; i++) {
      const interetMois = capitalRestant * (TAUX_FIXE / 100 / 12);
      const capitalMois = mensualite - interetMois;
      capitalRestant = Math.max(0, capitalRestant - capitalMois);

      rows.push({
        mois: i,
        mensualite: Math.round(mensualite * 100) / 100,
        capital: Math.round(capitalMois * 100) / 100,
        interet: Math.round(interetMois * 100) / 100,
        restant: Math.round(capitalRestant * 100) / 100,
      });
    }

    return rows;
  }, [montant, mensualite]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const goToApplication = () => {
    const params = new URLSearchParams({
      type: selectedType,
      montant: montant.toString(),
      duree: duree.toString(),
      mensualite: mensualite.toString(),
      coutTotal: coutTotal.toString(),
      interets: interets.toString(),
    });

    window.location.href = `/faire-demande?${params.toString()}`;
  };

  return (
    <main className="min-h-screen w-full max-w-full bg-[#050816] text-white overflow-x-hidden">
      <Header />

      <section
        id="accueil"
        className="relative min-h-screen pt-28 pb-20 flex items-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98133,transparent_32%),radial-gradient(circle_at_bottom_right,#2563eb33,transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(5,8,22,0.94))]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-2xl px-5 py-2 rounded-full text-sm text-zinc-300 mb-8">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Plateforme de financement premium
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-[1.02]">
              Financez vos projets avec une expérience claire, moderne et sécurisée.
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mt-8 leading-relaxed">
              Essor Crédit vous accompagne dans vos demandes de financement avec
              un parcours fluide : simulation, dépôt de demande, suivi en ligne et
              espace client sécurisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="#simulateur">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-base">
                  Simuler mon financement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>

              <Link href="/espace-client">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-base"
                >
                  Accéder à mon espace client
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl">
  {assurances.map((item, index) => (
    <motion.div
      key={item}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/8 border border-white/10 rounded-2xl p-4 text-sm text-zinc-300 hover:bg-white/10 transition"
    >
      <CheckCircle className="w-5 h-5 text-emerald-300 mb-3" />
      {item}
    </motion.div>
  ))}
</div>
</motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <Card className="w-full max-w-full bg-white/10 border-white/10 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
              <CardContent className="p-4 sm:p-6 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-zinc-400 text-sm">Simulation rapide</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {montant.toLocaleString("fr-FR")} €
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-emerald-300" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-zinc-400">Montant</span>
                      <span>{montant.toLocaleString("fr-FR")} €</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={2000000}
                      step={1000}
                      value={montant}
                      onChange={(e) => setMontant(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-zinc-400">Durée</span>
                      <span>
                        {Math.floor(duree / 12)} ans {duree % 12} mois
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={360}
                      step={6}
                      value={duree}
                      onChange={(e) => setDuree(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>
                </div>

                <div className="mt-8 bg-black/25 border border-white/10 rounded-3xl p-6">
                  <p className="text-zinc-400 text-sm">Mensualité estimée</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {mensualite.toLocaleString("fr-FR")} €
                    <span className="text-base text-zinc-400"> / mois</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
                    <div>
                      <p className="text-zinc-500">Taux affiché</p>
                      <p className="font-semibold text-emerald-300">3,00%</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Durée</p>
                      <p className="font-semibold">{duree} mois</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={goToApplication}
                  className="w-full h-14 mt-7 rounded-2xl bg-emerald-500 hover:bg-emerald-600"
                >
                  Continuer ma demande
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-white/[0.03] backdrop-blur-xl py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-sm text-zinc-300">
  {[
    { icon: <Lock className="w-5 h-5 text-emerald-300" />, text: "Connexion sécurisée" },
    { icon: <Clock className="w-5 h-5 text-emerald-300" />, text: "Suivi en ligne" },
    { icon: <Headphones className="w-5 h-5 text-emerald-300" />, text: "Accompagnement humain" },
    { icon: <Shield className="w-5 h-5 text-emerald-300" />, text: "Données protégées" },
  ].map((item, index) => (
    <motion.div
      key={item.text}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 hover:bg-white/10 transition"
    >
      {item.icon}
      {item.text}
    </motion.div>
  ))}
</div>
      </section>

      <section className="py-24 bg-[#050816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-emerald-300 font-medium mb-3">Solutions</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Des financements adaptés à chaque projet
              </h2>
            </div>
            <p className="text-zinc-400 max-w-xl">
              Sélectionnez le type de financement correspondant à votre besoin,
              puis lancez une simulation personnalisée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (

  <motion.button

    key={service.title}

    initial={{ opacity: 0, y: 22 }}

    whileInView={{ opacity: 1, y: 0 }}

    viewport={{ once: true, amount: 0.2 }}

    transition={{ duration: 0.45, delay: index * 0.06 }}

    whileHover={{ y: -8, scale: 1.015 }}

    whileTap={{ scale: 0.99 }}

    onClick={() => {

      setSelectedType(service.title);

      setActiveService(index);

    }}

    className={`group text-left rounded-[2rem] p-7 border transition-all ${

      selectedType === service.title || activeService === index

        ? "bg-emerald-500/15 border-emerald-400/35 shadow-lg shadow-emerald-500/10"

        : "bg-white/7 border-white/10 hover:bg-white/10"

    }`}

  >

    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-300 mb-6 transition-transform duration-300 group-hover:scale-110">

      {service.icon}

    </div>

    <h3 className="text-xl font-semibold">{service.title}</h3>

    <p className="text-emerald-300 text-sm mt-2">

      {service.shortDesc}

    </p>

    <p className="text-zinc-400 mt-4 text-sm leading-relaxed">

      {service.description}

    </p>

  </motion.button>

))}
          </div>
        </div>
      </section>

      <section id="simulateur" className="py-16 sm:py-24 bg-[#07111f]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
      <p className="text-emerald-300 font-medium mb-3">Simulation</p>

      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight">
        Estimez votre financement
      </h2>

      <p className="text-zinc-400 mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed">
        Ajustez le montant et la durée pour obtenir une estimation claire
        de votre mensualité.
      </p>
    </div>

    <Card className="w-full bg-white/10 border-white/10 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
      <CardContent className="p-3 sm:p-6 md:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">

          {/* COLONNE GAUCHE */}
          <div className="xl:col-span-7 space-y-6 sm:space-y-8">

            {/* TYPE */}
            <div>

  <Label className="text-zinc-300 mb-4 block text-base sm:text-lg">

    Type de financement

  </Label>

  <div className="-mx-4 px-4 overflow-x-auto lg:overflow-visible pb-3">

    <div className="flex lg:grid lg:grid-cols-3 gap-3 min-w-max lg:min-w-0">

      {services.slice(0, 6).map((service) => (

        <button

          key={service.title}

          onClick={() => setSelectedType(service.title)}

          className={`w-[210px] lg:w-full shrink-0 rounded-3xl border p-5 text-left transition min-h-[150px] flex flex-col justify-between ${

            selectedType === service.title

              ? "bg-emerald-500/20 border-emerald-400/40"

              : "bg-black/20 border-white/10 hover:bg-white/10"

          }`}

        >

          <div className="text-emerald-300 mb-5">

            {service.icon}

          </div>

          <p className="text-base font-semibold leading-snug">

            {service.title}

          </p>

        </button>

      ))}

    </div>

  </div>

</div>

            {/* MONTANT + DURÉE */}
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black/20 border border-white/10 rounded-3xl p-4 sm:p-6">
                <Label className="text-zinc-400">Montant du prêt</Label>

                <Input
                  type="number"
                  value={montant}
                  onChange={(e) =>
                    setMontant(
                      Math.max(0, Math.min(2000000, Number(e.target.value) || 0))
                    )
                  }
                  className="mt-4 h-12 sm:h-14 bg-white/10 border-white/10 text-white text-xl sm:text-2xl font-semibold rounded-2xl"
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

              <div className="bg-black/20 border border-white/10 rounded-3xl p-4 sm:p-6">
                <Label className="text-zinc-400">Durée du prêt</Label>

                <Input
                  type="number"
                  value={duree}
                  onChange={(e) =>
                    setDuree(
                      Math.max(6, Math.min(360, Number(e.target.value) || 6))
                    )
                  }
                  className="mt-4 h-12 sm:h-14 bg-white/10 border-white/10 text-white text-xl sm:text-2xl font-semibold rounded-2xl"
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

            {/* MOBILE CARDS */}
            <div className="space-y-3 md:hidden">
              {amortissement.map((row) => (
                <div
                  key={row.mois}
                  className="bg-black/20 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-zinc-400">Mois</span>
                    <span className="font-semibold">{row.mois}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Mensualité</span>
                    <span className="font-semibold">
                      {row.mensualite.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Intérêts</span>
                    <span className="text-amber-300">
                      {row.interet.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Capital</span>
                    <span className="text-emerald-300">
                      {row.capital.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Restant</span>
                    <span>{row.restant.toLocaleString("fr-FR")} €</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block w-full overflow-x-auto rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-zinc-400">
                  <tr>
                    <th className="p-4 text-left">Mois</th>
                    <th className="p-4 text-right">Mensualité</th>
                    <th className="p-4 text-right">Intérêts</th>
                    <th className="p-4 text-right">Capital</th>
                    <th className="p-4 text-right">Restant</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {amortissement.map((row) => (
                    <tr key={row.mois} className="hover:bg-white/5">
                      <td className="p-4">{row.mois}</td>
                      <td className="p-4 text-right font-semibold">
                        {row.mensualite.toLocaleString("fr-FR")} €
                      </td>
                      <td className="p-4 text-right text-amber-300">
                        {row.interet.toLocaleString("fr-FR")} €
                      </td>
                      <td className="p-4 text-right text-emerald-300">
                        {row.capital.toLocaleString("fr-FR")} €
                      </td>
                      <td className="p-4 text-right text-zinc-300">
                        {row.restant.toLocaleString("fr-FR")} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="xl:col-span-5">
            <div className="xl:sticky xl:top-28 bg-gradient-to-br from-emerald-500/20 to-white/5 border border-emerald-400/20 rounded-[2rem] p-4 sm:p-7 md:p-8">
              <p className="text-zinc-400">Résultat estimatif</p>

              <p className="text-3xl sm:text-5xl md:text-6xl font-bold mt-4 break-words leading-tight">
                {mensualite.toLocaleString("fr-FR")} €
                <span className="text-sm sm:text-base text-zinc-400">
                  {" "}
                  / mois
                </span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="text-zinc-500 text-sm">Montant</p>
                  <p className="font-semibold mt-1">
                    {montant.toLocaleString("fr-FR")} €
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="text-zinc-500 text-sm">Durée</p>
                  <p className="font-semibold mt-1">{duree} mois</p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="text-zinc-500 text-sm">Coût total</p>
                  <p className="font-semibold mt-1">
                    {coutTotal.toLocaleString("fr-FR")} €
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  <p className="text-zinc-500 text-sm">Intérêts</p>
                  <p className="font-semibold text-amber-300 mt-1">
                    {interets.toLocaleString("fr-FR")} €
                  </p>
                </div>
              </div>

              <Button
                onClick={goToApplication}
                className="w-full h-14 mt-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-sm sm:text-base px-4 flex items-center justify-center gap-2"
              >
                <span className="truncate">Valider cette simulation</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Button>

              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                Cette simulation est indicative et ne constitue pas une offre
                définitive. Les conditions finales dépendent de l’analyse du
                dossier.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</section>

      <section className="py-24 bg-[#050816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-emerald-300 font-medium mb-3">Parcours client</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Un suivi simple, étape par étape
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {processSteps.map((step, index) => (
  <motion.div
    key={step.title}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
  >
    <Card className="h-full bg-white/7 border-white/10 rounded-[2rem] hover:bg-white/10 transition">
      <CardContent className="p-7">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 mb-6">
          {step.icon}
        </div>

        <p className="text-sm text-zinc-500 mb-2">
          Étape {index + 1}
        </p>

        <h3 className="text-xl font-semibold text-white">
          {step.title}
        </h3>

        <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
          {step.description}
        </p>
      </CardContent>
    </Card>
  </motion.div>
))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#07111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div

      initial={{ opacity: 0, x: -30 }}

      whileInView={{ opacity: 1, x: 0 }}

      viewport={{ once: true, amount: 0.25 }}

      transition={{ duration: 0.55 }}

      className="lg:col-span-6"

    >

      <p className="text-emerald-300 font-medium mb-3">Espace client</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Un tableau de bord premium pour suivre votre dossier
            </h2>
            <p className="text-zinc-400 mt-6 leading-relaxed text-lg">
              Après votre demande, vous recevez des identifiants pour accéder à
              votre espace client : statut, étapes, documents, contrat signé et
              suivi de votre dossier.
            </p>
                        <Link href="/espace-client">
              <Button className="mt-8 h-14 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200">
                Ouvrir l’espace client
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="lg:col-span-6">
            <div className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl">
              <div className="bg-[#050816] rounded-[2rem] p-6 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-sm">Dossier D-248913</p>
                    <p className="text-3xl font-bold mt-2">75 000 €</p>
                    <p className="text-zinc-400 mt-1">Prêt Personnel</p>
                  </div>
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 rounded-full px-4 py-2 text-sm">
                    Accepté
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/7 rounded-2xl p-4 border border-white/10">
                    <p className="text-zinc-500 text-xs">Durée</p>
                    <p className="font-semibold mt-1">120 mois</p>
                  </div>
                  <div className="bg-white/7 rounded-2xl p-4 border border-white/10">
                    <p className="text-zinc-500 text-xs">Mensualité</p>
                    <p className="font-semibold mt-1">724 €</p>
                  </div>
                  <div className="bg-white/7 rounded-2xl p-4 border border-white/10">
                    <p className="text-zinc-500 text-xs">Documents</p>
                    <p className="font-semibold mt-1">4 reçus</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {["Demande reçue", "Analyse", "Validation", "Signature"].map(
                    (item, index) => (
                      <div key={item} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <p className="text-zinc-300">{item}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#07111f] overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-14">
      <p className="text-emerald-300 font-medium mb-3">Partenaires</p>

      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        Un réseau de partenaires financiers
      </h2>

      <p className="text-zinc-400 mt-5 text-lg">
        Nous travaillons avec différents acteurs bancaires, financiers et
        technologiques afin d’accompagner les demandes selon les profils et les
        projets.
      </p>
    </div>

    {/* SLIDER */}
    <div className="relative">
      {/* Fade gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#07111f] to-transparent z-10 pointer-events-none" />

      {/* Fade droite */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#07111f] to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-4 min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 28,
          }}
        >
          {[
            { name: "Boursorama Banque", logo: "/partners/boursorama-banque.png" },
            { name: "AXA Investment", logo: "/partners/axa_investment.png" },
            { name: "Banque Palatine", logo: "/partners/banque-palatine.png" },
            { name: "Caisse d’Epargne", logo: "/partners/caisse-d-epargne.png" },
            { name: "HSBC Bank", logo: "/partners/hsbc-bank.png" },
            { name: "Natixis", logo: "/partners/natixis.png" },
            { name: "BNP Paribas", logo: "/partners/bnp-paribas.png" },
            { name: "Rothschild & Co", logo: "/partners/rothschild-co.png" },
            { name: "Milleis Banque", logo: "/partners/milleis-banque.png" },

            /* DUPLICATION pour boucle fluide */
            { name: "Boursorama Banque", logo: "/partners/boursorama-banque.png" },
            { name: "AXA Investment", logo: "/partners/axa_investment.png" },
            { name: "Banque Palatine", logo: "/partners/banque-palatine.png" },
            { name: "Caisse d’Epargne", logo: "/partners/caisse-d-epargne.png" },
            { name: "HSBC Bank", logo: "/partners/hsbc-bank.png" },
            { name: "Natixis", logo: "/partners/natixis.png" },
            { name: "BNP Paribas", logo: "/partners/bnp-paribas.png" },
            { name: "Rothschild & Co", logo: "/partners/rothschild-co.png" },
            { name: "Milleis Banque", logo: "/partners/milleis-banque.png" },
          ].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="w-44 sm:w-52 h-24 sm:h-28 shrink-0 bg-white/7 border border-white/10 rounded-3xl flex items-center justify-center p-5 hover:bg-white/10 transition"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 sm:max-h-12 max-w-[130px] sm:max-w-[150px] object-contain opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>

    
  </div>
</section>

      <section className="py-24 bg-[#050816]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-14">
      <p className="text-emerald-300 font-medium mb-3">Avis clients</p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        Une expérience pensée pour rassurer
      </h2>
      <p className="text-zinc-400 mt-5 text-lg">
        Des clients accompagnés dans leurs démarches, avec un suivi clair et un espace en ligne professionnel.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {[
        {
          name: "Sophie Martin",
          location: "Paris",
          text: "Interface très claire, suivi sérieux et réponse rapide. J’ai pu transmettre mes documents directement depuis mon espace client.",
        },
        {
          name: "Marc Dubois",
          location: "Lyon",
          text: "Le parcours est simple et professionnel. La simulation m’a permis de mieux comprendre ma mensualité avant de déposer ma demande.",
        },
        {
          name: "Laura Benali",
          location: "Marseille",
          text: "Très bonne expérience. Le tableau de bord donne une vraie visibilité sur les étapes du dossier et les documents attendus.",
        },
      ].map((avis, index) => (
        <motion.div
          key={avis.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          whileHover={{ y: -6 }}
        >
          <Card className="h-full bg-white/7 border-white/10 rounded-[2rem] hover:bg-white/10 transition">
            <CardContent className="p-8">
              <div className="flex items-center gap-1 text-emerald-300 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>

              <p className="text-zinc-300 leading-relaxed">“{avis.text}”</p>

              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 font-semibold">
                  {avis.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>

                <div>
                  <p className="font-semibold text-white">{avis.name}</p>
                  <p className="text-sm text-zinc-500">{avis.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <section className="py-16 sm:py-24 bg-[#050816]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-white/5 border-white/10 rounded-[2rem]">
        <CardContent className="p-6 sm:p-8 md:p-10">
          <Banknote className="w-10 h-10 text-emerald-300 mb-8" />

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Prêt à lancer votre demande ?
          </h2>

          <p className="text-zinc-300 mt-5 max-w-2xl leading-relaxed">
            Commencez par une simulation, puis transmettez votre demande
            depuis un parcours clair et sécurisé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a href="#simulateur" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600">
                Simuler maintenant
              </Button>
            </a>

            <Link href="/faire-demande" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10"
              >
                Faire une demande
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/7 border-white/10 rounded-[2rem] hover:bg-white/10 transition">
        <CardContent className="p-6 sm:p-8">
          <Headphones className="w-10 h-10 text-emerald-300 mb-8" />

          <h3 className="text-2xl font-semibold">Besoin d’aide ?</h3>

          <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
            Un conseiller peut vous accompagner pour clarifier votre demande
            et préparer votre dossier.
          </p>

          <div className="flex gap-3 mt-8">
            <a
              href="https://wa.me/33600000000"
              target="_blank"
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition"
            >
              <Phone className="w-5 h-5" />
            </a>

            <a
              href="https://facebook.com/essorcredit"
              target="_blank"
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</section>

      <footer className="bg-[#030712] border-t border-white/10 py-12 sm:py-14">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row justify-between gap-10">
      {/* MARQUE */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="max-w-lg"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-white"
          >
            EC
          </motion.div>

          <p className="text-2xl font-bold text-white">Essor Crédit</p>
        </div>

        <p className="text-zinc-500 mt-5 max-w-md text-sm leading-relaxed">
          Plateforme de simulation, demande et suivi de financement.
          Les informations affichées doivent être vérifiées et adaptées
          à votre statut réel avant mise en production.
        </p>
      </motion.div>

      {/* LIENS */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-sm"
      >
        <div className="space-y-3 text-zinc-400">
          <p className="font-semibold text-white mb-4">Navigation</p>

          <a
            href="#simulateur"
            className="block hover:text-white transition"
          >
            Simulateur
          </a>

          <Link
            href="/faire-demande"
            className="block hover:text-white transition"
          >
            Faire une demande
          </Link>

          <Link
            href="/espace-client"
            className="block hover:text-white transition"
          >
            Espace client
          </Link>
        </div>

        <div className="space-y-3 text-zinc-400">
          <p className="font-semibold text-white mb-4">Informations</p>

          <Link
            href="/mentions-legales"
            className="block hover:text-white transition"
          >
            Mentions légales
          </Link>

          <Link
            href="/cgu"
            className="block hover:text-white transition"
          >
            CGU
          </Link>

          <Link
            href="/politique-de-confidentialite"
            className="block hover:text-white transition"
          >
            Confidentialité
          </Link>
        </div>
      </motion.div>
    </div>

    {/* BAS DE PAGE */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="border-t border-white/10 mt-12 pt-6 text-xs text-zinc-600 flex flex-col md:flex-row justify-between gap-4"
    >
      <p>© 2026 Essor Crédit. Tous droits réservés.</p>

      <p>
        Simulation indicative — conditions soumises à étude du dossier.
      </p>
    </motion.div>
  </div>
</footer>

<motion.a
  href="#accueil"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  whileHover={{ scale: 1.08, y: -3 }}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center"
>
  <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
</motion.a>

    </main>
  );
}