"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shield,
  Clock,
  BadgeEuro,
  Briefcase,
  CheckCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      icon: BadgeEuro,
      q: "Quels sont les montants de prêt proposés ?",
      a: "Nous proposons des financements de 2 000 € à 1 500 000 € selon votre profil, votre capacité financière et la nature de votre projet (personnel, immobilier, professionnel ou restructuration).",
    },
    {
      icon: Shield,
      q: "Quel est le taux d'intérêt appliqué ?",
      a: "Nos solutions débutent à partir de 3.0% fixe, sous réserve d’étude complète du dossier. Le taux final dépend du montant, de la durée et du profil emprunteur.",
    },
    {
      icon: Clock,
      q: "Combien de temps faut-il pour obtenir une réponse ?",
      a: "Une première analyse est généralement effectuée sous 24 heures ouvrées, avec un accompagnement personnalisé par un conseiller dédié.",
    },
    {
      icon: CheckCircle,
      q: "Puis-je faire une simulation sans engagement ?",
      a: "Oui. Toutes nos simulations sont gratuites, instantanées et sans engagement.",
    },
    {
      icon: Briefcase,
      q: "Acceptez-vous les profils indépendants ?",
      a: "Oui, nous proposons des solutions premium adaptées aux indépendants, professions libérales, commerçants et entrepreneurs.",
    },
    {
      icon: BadgeEuro,
      q: "Est-ce que je peux regrouper plusieurs crédits ?",
      a: "Oui. Nos offres de rachat de crédits permettent de centraliser plusieurs mensualités en une seule, souvent avec une meilleure visibilité budgétaire.",
    },
    {
      icon: Shield,
      q: "Quels documents sont nécessaires ?",
      a: "Pièce d’identité valide, justificatifs de revenus, relevés bancaires récents, justificatif de domicile, et selon le profil : documents professionnels ou fiscaux.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.08),_transparent_35%),linear-gradient(to_bottom,_#020617,_#0A1428,_#020617)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-300">
              Assistance & Transparence Premium
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Questions Fréquentes
          </h1>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Retrouvez instantanément les réponses aux questions les plus
            fréquentes concernant nos solutions de financement premium.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-14 max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <Input
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-16 pl-14 rounded-3xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 text-lg"
          />
        </div>

        {/* FAQ Cards */}
        <div className="space-y-5">
          {filteredFaqs.map((item, i) => {
            const Icon = item.icon;
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : i)
                    }
                    className="w-full text-left"
                  >
                    <CardContent className="p-7">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-emerald-400" />
                          </div>

                          <h3 className="text-xl md:text-2xl font-semibold text-white">
                            {item.q}
                          </h3>
                        </div>

                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                        >
                          <ChevronDown className="w-6 h-6 text-zinc-400" />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 pl-[76px]">
                              <p className="text-zinc-300 leading-relaxed text-lg">
                                {item.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </button>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-3xl p-10">
            <h3 className="text-3xl font-bold mb-4">
              Vous avez encore des questions ?
            </h3>
            <p className="text-zinc-400 mb-8 text-lg">
              Nos conseillers premium vous accompagnent personnellement.
            </p>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all hover:scale-105"
            >
              Contacter un conseiller
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}