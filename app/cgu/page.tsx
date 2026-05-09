"use client";

import {
  FileText,
  Shield,
  Scale,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function CGU() {
  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.08),_transparent_35%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/10 mb-8">
            <Scale className="w-5 h-5 text-emerald-300" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Cadre d’utilisation du service
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Conditions Générales d’Utilisation
          </h1>

          <p className="text-lg text-zinc-400">
            Dernière mise à jour : 30 avril 2026
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* Objet */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <FileText className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">1. Objet</h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Les présentes Conditions Générales d’Utilisation (CGU) ont pour
              objet de définir les modalités d’accès et d’utilisation du site
              Essor Crédit, ainsi que les droits et obligations des
              utilisateurs dans le cadre des services proposés.
            </p>
          </section>

          {/* Services */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                2. Services proposés
              </h2>
            </div>

            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>Essor Crédit propose notamment :</p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                  Simulation de financement en ligne
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                  Dépôt et suivi de demandes de prêt
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                  Mise en relation avec des partenaires financiers
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                  Accompagnement administratif et documentaire
                </li>
              </ul>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                3. Limitation de responsabilité
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Essor Crédit agit en qualité d’intermédiaire. Les décisions
              définitives relatives à l’acceptation, au montant, au taux ou aux
              conditions d’un financement relèvent exclusivement des
              établissements partenaires ou organismes prêteurs.
            </p>
          </section>

          {/* Utilisateur */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                4. Engagement de l’utilisateur
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              L’utilisateur s’engage à fournir des informations exactes,
              complètes et à jour lors de toute simulation ou demande. Toute
              fausse déclaration ou tentative de fraude peut entraîner le refus
              immédiat du dossier.
            </p>
          </section>

          {/* Données */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                5. Protection des données
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Les données collectées via le site sont traitées conformément à
              la réglementation applicable en matière de protection des données,
              notamment le RGPD, et utilisées uniquement dans le cadre du
              traitement des demandes et de la relation client.
            </p>
          </section>

          {/* Droit applicable */}
          <section className="bg-gradient-to-br from-emerald-500/15 to-white/5 border border-emerald-400/15 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Scale className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                6. Droit applicable
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Les présentes CGU sont soumises au droit français. En cas de
              litige, et sauf disposition légale contraire, les juridictions
              compétentes seront celles du ressort du siège social de
              l’exploitant.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}