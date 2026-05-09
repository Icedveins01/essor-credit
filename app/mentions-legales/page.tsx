"use client";

import {
  Building2,
  FileCheck,
  Globe,
  ShieldCheck,
  Scale,
  BadgeCheck,
} from "lucide-react";

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.08),_transparent_35%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/10 mb-8">
            <Scale className="w-5 h-5 text-emerald-300" />
            <span className="text-sm text-zinc-300 tracking-wide">
              Transparence & conformité
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Mentions Légales
          </h1>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Retrouvez ici l’ensemble des informations légales, réglementaires
            et techniques relatives à l’exploitation du site Essor Crédit.
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* Société */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                Informations légales
              </h2>
            </div>

            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Essor Crédit</strong> est un
                site exploité par :
              </p>

              <p>
                SAS Essor Finance
                <br />
                Siège social : 123 Avenue des Champs-Élysées, 75008 Paris,
                France
                <br />
                SIREN : XXXXXXXX
                <br />
                RCS Paris B XXXXXXX
              </p>
            </div>
          </section>

          {/* ORIAS */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <BadgeCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                Intermédiaire en Opérations de Banque et Services de Paiement
                (IOBSP)
              </h2>
            </div>

            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                Numéro ORIAS :{" "}
                <strong className="text-white">XXXXXXXX</strong>
              </p>

              <p>
                Immatriculé auprès de l’Organisme pour le Registre des
                Intermédiaires en Assurance, Banque et Finance (ORIAS),
                conformément à la réglementation française en vigueur.
              </p>
            </div>
          </section>

          {/* Hébergeur */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <Globe className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">Hébergeur</h2>
            </div>

            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                Nom .
                <br />
                Adresse #4133
                <br />
                Ville Code Postal
                <br />
                Pays
              </p>
            </div>
          </section>

          {/* Publication */}
          <section className="bg-white/7 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <FileCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                Directeur de la publication
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              M. [Ton Nom]
            </p>
          </section>

          {/* Protection */}
          <section className="bg-gradient-to-br from-emerald-500/15 to-white/5 border border-emerald-400/15 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-3xl font-semibold">
                Protection des utilisateurs
              </h2>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Essor Crédit s’engage à protéger la confidentialité des données
              personnelles de ses utilisateurs, conformément au RGPD et aux
              réglementations applicables en matière de sécurité numérique.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}