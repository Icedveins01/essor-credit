"use client";

import {
  ShieldCheck,
  Database,
  Eye,
  Lock,
  Scale,
  UserCheck,
  BadgeInfo,
} from "lucide-react";

export default function PolitiqueConfidentialite() {
  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.08),_transparent_35%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/10 mb-8">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Protection & confidentialité
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Politique de Confidentialité
          </h1>

          <p className="text-lg text-zinc-400">
            Dernière mise à jour : 30 avril 2026
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* Données collectées */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Database className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                1. Données collectées
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Dans le cadre de nos services, nous pouvons collecter certaines
              informations nécessaires à l’étude et au traitement de vos
              demandes, notamment :
            </p>

            <ul className="space-y-3 text-zinc-300">
              <li>• Nom, prénom, sexe et coordonnées</li>
              <li>• Adresse postale et pays de résidence</li>
              <li>• Téléphone et adresse email</li>
              <li>• Informations professionnelles et financières</li>
              <li>• Documents justificatifs transmis via votre espace client</li>
            </ul>
          </section>

          {/* Utilisation */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Eye className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                2. Utilisation des données
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Les informations collectées sont utilisées exclusivement pour :
            </p>

            <ul className="space-y-3 text-zinc-300 mt-4">
              <li>• Étudier votre éligibilité financière</li>
              <li>• Gérer vos demandes et votre espace client</li>
              <li>• Assurer le suivi administratif et réglementaire</li>
              <li>• Améliorer l’expérience utilisateur et la sécurité</li>
              <li>• Respecter nos obligations légales et réglementaires</li>
            </ul>
          </section>

          {/* Sécurité */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                3. Sécurité des données
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Nous mettons en œuvre des mesures techniques, organisationnelles
              et de sécurité afin de protéger vos données contre tout accès non
              autorisé, perte, altération ou divulgation.
            </p>
          </section>

          {/* Droits */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">4. Vos droits</h2>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4">
              Conformément à la réglementation applicable (RGPD), vous disposez
              notamment des droits suivants :
            </p>

            <ul className="space-y-3 text-zinc-300">
              <li>• Droit d’accès à vos données</li>
              <li>• Droit de rectification</li>
              <li>• Droit d’effacement</li>
              <li>• Droit d’opposition</li>
              <li>• Droit à la portabilité</li>
            </ul>
          </section>

          {/* Conservation */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <BadgeInfo className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                5. Conservation des données
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Vos données sont conservées uniquement pendant la durée nécessaire
              au traitement de votre dossier, au respect de nos obligations
              légales et à la sécurisation de nos services.
            </p>
          </section>

          {/* Droit applicable */}
          <section className="bg-gradient-to-br from-emerald-500/15 to-white/5 border border-emerald-400/15 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Scale className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                6. Contact & réclamations
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Pour toute demande liée à vos données personnelles, vous pouvez
              contacter notre service dédié via la page Contact. Vous pouvez
              également introduire une réclamation auprès de l’autorité
              compétente en matière de protection des données.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}