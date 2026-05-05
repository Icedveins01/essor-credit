"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Header from "./components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  Car,
  User,
  RefreshCw,
  Shield,
  Briefcase,
  Heart,
  Wallet,
  Clock,
  Award,
  Users,
  CheckCircle,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function Page() {
  const [montant, setMontant] = useState<number>(150000);
  const [duree, setDuree] = useState<number>(180);
  const [selectedType, setSelectedType] = useState("Prêt Personnel");
  const [currentWhySlide, setCurrentWhySlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    { icon: <HomeIcon className="w-14 h-14" />, title: "Prêt Immobilier", shortDesc: "À partir de 2,85% sur 15 ans", description: "Financement pour l'achat, la construction ou la rénovation de votre résidence principale ou investissement locatif." },
    { icon: <RefreshCw className="w-14 h-14" />, title: "Rachat de Crédits", shortDesc: "Jusqu'à -60% sur vos mensualités", description: "Regroupez tous vos crédits en un seul prêt avec une mensualité réduite et une meilleure visibilité." },
    { icon: <Shield className="w-14 h-14" />, title: "Assurance de Prêt", shortDesc: "Jusqu'à 65% d'économies", description: "Protégez votre prêt avec une assurance adaptée à votre profil pour un coût optimisé." },
    { icon: <Wallet className="w-14 h-14" />, title: "Crédit à la Consommation", shortDesc: "À partir de 0,90% sur 12 mois", description: "Financement rapide pour vos projets personnels : voyage, travaux, véhicule, etc." },
    { icon: <Car className="w-14 h-14" />, title: "Prêt Auto", shortDesc: "Financement rapide", description: "Obtenez un prêt adapté pour l'achat d'une voiture neuve ou d'occasion, avec ou sans apport." },
    { icon: <User className="w-14 h-14" />, title: "Prêt Personnel", shortDesc: "Pour tous vos projets", description: "Besoin d'argent pour un projet personnel ? Obtenez un crédit flexible sans justificatif d'utilisation." },
    { icon: <Heart className="w-14 h-14" />, title: "Mutuelle Santé", shortDesc: "Protégez votre famille", description: "Complémentaire santé performante pour vous et vos proches avec des garanties adaptées." },
    { icon: <Briefcase className="w-14 h-14" />, title: "Prêt Professionnel", shortDesc: "Pour les indépendants", description: "Solutions dédiées aux travailleurs indépendants, artisans, commerçants et professions libérales." },
  ];

  const whyUsCards = [
    { icon: <CheckCircle className="w-16 h-16 text-emerald-600" />, title: "Taux fixe à 3%", description: "Le meilleur taux du marché, fixe et garanti." },
    { icon: <Clock className="w-16 h-16 text-emerald-600" />, title: "Réponse en 24h", description: "Votre dossier étudié rapidement par un expert." },
    { icon: <Users className="w-16 h-16 text-emerald-600" />, title: "Accompagnement humain", description: "Un conseiller vous suit personnellement." },
    { icon: <Shield className="w-16 h-16 text-emerald-600" />, title: "100% Sécurisé", description: "Données protégées et confidentialité garantie." },
    { icon: <Award className="w-16 h-16 text-emerald-600" />, title: "IOBSP Officiel", description: "Intermédiaire en Opérations de Banque." },
  ];

  const testimonials = [
    { name: "Sophie Martin", location: "Paris", text: "J'ai obtenu mon crédit immobilier en 8 jours seulement. Le simulateur était ultra précis." },
    { name: "Marc Dubois", location: "Lyon", text: "En tant qu'indépendant, le rachat de crédit a été très simple et avantageux." },
    { name: "Laura Benali", location: "Marseille", text: "Accompagnement humain et professionnel. Je recommande Essor Crédit à 100% !" },
    { name: "Thomas Leclerc", location: "Bordeaux", text: "Prêt auto obtenu en moins de 10 jours. Service rapide et efficace." },
  ];

  // ==================== SIMULATEUR - TAUX FIXE 3% ====================
  const TAUX_FIXE = 3.0;
  const mensualite = (() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  })();

  const coutTotal = duree >= 6 ? Math.round(mensualite * duree * 100) / 100 : 0;
  const interets = duree >= 6 ? Math.round((coutTotal - montant) * 100) / 100 : 0;

  useEffect(() => {
    const whyInt = setInterval(() => setCurrentWhySlide((prev) => (prev + 1) % whyUsCards.length), 4500);
    const testInt = setInterval(() => setCurrentSlide((prev) => (prev + 1) % testimonials.length), 5000);
    return () => { clearInterval(whyInt); clearInterval(testInt); };
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      {/* HERO (inchangé) */}
      <section id="accueil" className="relative min-h-screen bg-[#0A1428] overflow-hidden flex items-center pt-24">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 15] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} color="#67e8f9" intensity={1.5} />
            <Stars radius={300} depth={60} count={12000} factor={7} saturation={0} fade speed={0.8} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
          </Canvas>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-2xl px-7 py-2.5 rounded-3xl mb-8 text-sm border border-white/30 tracking-widest mx-auto">
            ⚡ Simulation gratuite en quelques secondes
          </div>
          <h1 className="text-7xl md:text-[82px] font-bold tracking-[-4px] leading-none mb-8">
            L'essor de votre patrimoine<br />commence aujourd’hui
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-200 max-w-4xl mx-auto leading-relaxed mb-12">
            Des solutions de financement d’exception, à taux fixe avantageux,
            avec un accompagnement humain et une expertise sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#simulateur" className="px-14 py-7 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-semibold text-2xl transition-all hover:scale-105 shadow-2xl">
              Simuler mon prêt gratuitement
            </a>
            <a href="/faire-demande" className="px-14 py-7 border-2 border-white/70 hover:bg-white/10 rounded-3xl font-semibold text-2xl transition-all">
              Faire une demande personnalisée
            </a>
          </div>
          <div className="mt-16 flex items-center justify-center gap-10 text-sm text-zinc-400">
            <div>Déblocage des fonds en moyenne sous 48H</div>
            <div>Conseillers experts à votre écoute</div>
          </div>
        </div>
      </section>

      {/* BADGES */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-zinc-500">
          <div className="flex items-center gap-3 hover:scale-105 transition-transform"><Shield className="w-5 h-5 text-emerald-600" /> Sécurisé & Confidentiel</div>
          <div className="flex items-center gap-3 hover:scale-105 transition-transform"><Briefcase className="w-5 h-5 text-emerald-600" /> Intermédiaire IOBSP</div>
          <div className="flex items-center gap-3 hover:scale-105 transition-transform"><Clock className="w-5 h-5 text-emerald-600" /> Réponse sous 24h</div>
          <div className="flex items-center gap-3 hover:scale-105 transition-transform"><Users className="w-5 h-5 text-emerald-600" /> +12 450 clients satisfaits</div>
        </div>
      </div>

      {/* NOS SERVICES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">Nos Services</h2>
            <p className="text-xl text-zinc-600">Des solutions adaptées à tous vos besoins financiers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <Card key={i} className="group h-full border border-zinc-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="h-20 flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-center">{service.title}</h3>
                  <p className="text-emerald-600 text-sm font-medium text-center mb-6">{service.shortDesc}</p>
                  <p className="text-zinc-600 text-[15px] leading-relaxed text-center flex-grow">{service.description}</p>
                  <div className="h-1 w-12 bg-emerald-600 mx-auto mt-8 rounded-full group-hover:w-20 transition-all"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SIMULATEUR PREMIUM ===================== */}
<div id="simulateur" className="max-w-5xl mx-auto px-6 py-20">
  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
    <Card className="shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <CardTitle className="text-4xl text-center">Simulateur de Prêt</CardTitle>
        <p className="text-center text-emerald-100 mt-3 text-lg">Taux fixe à 3% pour tous les prêts</p>
      </CardHeader>

      <CardContent className="p-10 space-y-12">
        {/* Type de prêt */}
        <div>
          <Label className="text-xl mb-4 block">Type de prêt</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((service, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(service.title)}
                className={`p-4 rounded-2xl text-sm font-medium transition-all border ${
                  selectedType === service.title
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {service.title}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Label className="text-xl mb-3 block">Montant du prêt (€)</Label>
            <Input
              type="number"
              value={montant}
              onChange={(e) => setMontant(Math.max(0, Math.min(2000000, Number(e.target.value) || 0)))}
                    className="text-3xl h-16 text-center font-semibold"
            />
            <input type="range" min={0} max={2000000} step={1000} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-emerald-600 mt-4" />
              
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Label className="text-xl mb-3 block">Durée du prêt (mois)</Label>
            <Input
              type="number"
              value={duree}
              onChange={(e) => setDuree(Math.max(0, Math.min(360, Number(e.target.value) || 0)))}
                    className="text-3xl h-16 text-center font-semibold"
            />
            <input type="range" min={0} max={360} step={6} value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full accent-emerald-600 mt-4" />
            <p className="text-center mt-3 text-lg font-medium text-emerald-600">
              {Math.floor(duree / 12)} ans et {duree % 12} mois
            </p>
          </motion.div>
        </div>

        {/* Résultat Premium (comme sur ta capture) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900 text-white rounded-3xl p-10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-emerald-400 text-sm">TAUX FIXE</p>
              <p className="text-6xl font-bold text-emerald-400">3.0%</p>
            </div>
            <div>
              <p className="text-zinc-400">Mensualité estimée</p>
              <p className="text-5xl font-bold mt-1">{mensualite.toLocaleString('fr-FR')} €</p>
              <p className="text-sm text-zinc-500">/ mois</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-700 md:border-none md:pt-0">
              <div>
                <p className="text-zinc-400">Coût total</p>
                <p className="font-semibold text-lg">{coutTotal.toLocaleString('fr-FR')} €</p>
              </div>
              <div>
                <p className="text-zinc-400">Intérêts</p>
                <p className="font-semibold text-orange-400 text-lg">{interets.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tableau d'amortissement - 12 mois par défaut */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Tableau d'amortissement</h3>
            <span className="text-sm text-zinc-500">Premiers 12 mois</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full min-w-[700px]">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-4 text-left font-medium">Mois</th>
                  <th className="p-4 text-right font-medium">Mensualité</th>
                  <th className="p-4 text-right font-medium text-orange-600">Intérêts</th>
                  <th className="p-4 text-right font-medium text-emerald-600">Capital remboursé</th>
                  <th className="p-4 text-right font-medium">Capital restant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(() => {
                  const table = [];
                  let capitalRestant = montant;
                  const tauxMensuel = TAUX_FIXE / 100 / 12;
                  for (let mois = 1; mois <= 12; mois++) {
                    const interet = Math.round(capitalRestant * tauxMensuel * 100) / 100;
                    const capital = Math.round((mensualite - interet) * 100) / 100;
                    capitalRestant = Math.max(0, Math.round((capitalRestant - capital) * 100) / 100);
                    table.push({ mois, mensualite: Math.round(mensualite * 100) / 100, interet, capital, restant: capitalRestant });
                  }
                  return table;
                })().map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="p-4 font-medium">{row.mois}</td>
                    <td className="p-4 text-right font-semibold">{row.mensualite.toLocaleString('fr-FR')} €</td>
                    <td className="p-4 text-right text-orange-600">{row.interet.toLocaleString('fr-FR')} €</td>
                    <td className="p-4 text-right text-emerald-600">{row.capital.toLocaleString('fr-FR')} €</td>
                    <td className="p-4 text-right font-medium">{row.restant.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-zinc-500 mt-4">
            Total intérêts sur {duree} mois : <span className="font-semibold text-orange-600">{interets.toLocaleString('fr-FR')} €</span>
          </p>
        </div>

        {/* Bouton final */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => {
              const params = new URLSearchParams({
                type: selectedType,
                montant: montant.toString(),
                duree: duree.toString(),
                mensualite: mensualite.toString(),
                coutTotal: coutTotal.toString(),
                interets: interets.toString(),
              });
              window.location.href = `/faire-demande?${params.toString()}`;
            }}
            className="w-full py-8 text-xl font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-3xl shadow-xl btn-premium"
          >
            Valider cette simulation et faire ma demande
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
</div>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-xl text-zinc-600">Un service simple, transparent et humain</p>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentWhySlide * 100}%)` }}>
              {whyUsCards.map((card, i) => (
                <div key={i} className="min-w-full px-8 py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-8 bg-emerald-50 rounded-3xl flex items-center justify-center transition-transform hover:scale-110">
                    {card.icon}
                  </div>
                  <h3 className="text-3xl font-semibold mb-4">{card.title}</h3>
                  <p className="text-lg text-zinc-600 max-w-sm mx-auto">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BARRE BLANCHE */}
      <div className="h-2 bg-white"></div>


      {/* NOS PARTENAIRES BANCAIRES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-4">Nos partenaires bancaires</h2>
          <p className="text-center text-zinc-600 mb-12">Nous travaillons avec les plus grandes institutions financières</p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <img src="/partners/boursorama-banque.png" alt="Boursorama Banque" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/axa_investment.png" alt="Axa Investment" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/banque-palatine.png" alt="Banque Palatine" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/caisse-d-epargne.png" alt="Caisse d'Epargne" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/hsbc-bank.png" alt="Hsbc Bank" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/natixis.png" alt="Natixis" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/bnp-paribas.png" alt="Bnp Paribas" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/rothschild-co.png" alt="Rothschild Co" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
            <img src="/partners/milleis-banque.png" alt="Milleis Banque" className="h-16 w-auto opacity-75 hover:opacity-100 transition-all" />
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Les derniers avis</h2>
            <p className="text-xl text-zinc-600">Ce que nos clients disent de nous</p>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-full px-8 py-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-inner mb-6">
                    <div className="text-6xl text-gray-500">👤</div>
                  </div>
                  <p className="text-lg italic text-zinc-700 mb-8">"{t.text}"</p>
                  <p className="font-semibold text-emerald-700">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A2540] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
            <p className="text-2xl font-bold">Essor Crédit</p>
          </div>

          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Votre partenaire de confiance pour tous vos projets financiers.
          </p>

          {/* Boutons Réseaux Sociaux */}
          <div className="flex justify-center gap-6 mb-10">
            <a
              href="https://wa.me/33600000000"
              target="_blank"
              className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-emerald-600 rounded-2xl transition-all hover:scale-110"
            >
              <Phone className="w-7 h-7" />
            </a>
            <a
              href="https://facebook.com/essorcredit"
              target="_blank"
              className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-emerald-600 rounded-2xl transition-all hover:scale-110"
            >
              <MessageCircle className="w-7 h-7" />
            </a>
            
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400 mb-8">
            <a href="/mentions-legales" className="hover:text-white">Mentions légales</a>
            <a href="/cgu" className="hover:text-white">Conditions Générales d'Utilisation</a>
            <a href="/politique-de-confidentialite" className="hover:text-white">Politique de Confidentialité</a>
          </div>

          <p className="text-xs text-zinc-500">
            © 2026 Essor Crédit - Intermédiaire en Opérations de Banque et Services de Paiement (IOBSP) | ORIAS n° XXXXXXX
          </p>
        </div>
      </footer>

    </main>
  );
}
