"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [montant, setMontant] = useState<number>(0);
  const [duree, setDuree] = useState<number>(0);
  const [typeClient, setTypeClient] = useState<"particulier" | "independant">("particulier");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const TAUX_FIXE = 3.0;

  const mensualite = (() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  })();

  const coutTotal = duree >= 6 ? Math.round(mensualite * duree * 100) / 100 : 0;
  const interets = duree >= 6 ? Math.round((coutTotal - montant) * 100) / 100 : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      typeClient,
      prenom: formData.get("prenom"),
      nom: formData.get("nom"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
      revenuOuCA: formData.get("revenuOuCA"),
      charges: formData.get("charges"),
      message: formData.get("message"),
      montantSouhaite: montant,
      duree,
      mensualite,
      coutTotal,
      interets,
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
      alert("✅ Demande envoyée avec succès ! Nous vous contacterons sous 24h.");
    } catch (error) {
      alert("❌ Erreur lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
            <h1 className="text-2xl font-bold text-[#0A2540]">Essor Crédit</h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#accueil" className="hover:text-emerald-600 transition-colors">Accueil</a>
            <a href="#simulateur" className="hover:text-emerald-600 transition-colors">Simulateur</a>
            <a href="#demande" className="hover:text-emerald-600 transition-colors">Demande</a>
            <a href="#avis" className="hover:text-emerald-600 transition-colors">Avis clients</a>
          </nav>
          <Button onClick={() => document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth' })}>
            Faire une demande
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section id="accueil" className="bg-[#0A2540] text-white pt-28 pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 px-6 py-2.5 rounded-full text-sm">⚡ Simulation gratuite en 2 minutes</div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
            Votre essor financier<br />commence aujourd’hui
          </h1>
          <p className="text-2xl text-zinc-300 mb-12">Prêts personnels • Crédit immobilier • Prêt auto • Solutions pour indépendants • Rachat de crédit</p>
        </div>
      </section>

      {/* SIMULATEUR */}
      <div id="simulateur" className="max-w-4xl mx-auto px-6 py-20">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
            <CardTitle className="text-4xl text-center">Simulateur de Prêt</CardTitle>
            <p className="text-center text-emerald-100 mt-3 text-lg">Taux fixe à 3% — Résultat instantané</p>
          </CardHeader>
          <CardContent className="p-10 space-y-14">
            <div className="group">
              <div className="flex justify-between mb-3">
                <Label className="text-xl">Montant du prêt</Label>
                <span className="text-5xl font-bold text-emerald-600">{montant.toLocaleString('fr-FR')} €</span>
              </div>
              <input type="range" min={2000} max={1500000} step={5000} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-emerald-600 mb-4" />
              <Input type="number" value={montant || ""} onChange={(e) => setMontant(Number(e.target.value) || 0)} className="no-spinner text-center text-4xl font-semibold h-20 rounded-3xl border-2 border-zinc-200 focus:border-emerald-600" placeholder="Entrez le montant souhaité" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-3">
                <Label className="text-xl">Durée du remboursement souhaité</Label>
                <span className="text-4xl font-semibold">{duree >= 6 ? `${Math.floor(duree / 12)} ans et ${duree % 12} mois` : ""}</span>
              </div>
              <input type="range" min={6} max={360} step={6} value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full accent-emerald-600 mb-4" />
              <Input type="number" value={duree || ""} onChange={(e) => setDuree(Number(e.target.value) || 0)} onBlur={() => { if (duree < 6) setDuree(6); if (duree > 360) setDuree(360); }} className="no-spinner text-center text-4xl font-semibold h-20 rounded-3xl border-2 border-zinc-200 focus:border-emerald-600" placeholder="Nombre de mois (ex: 180)" />
            </div>

            <div className="pt-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-10 rounded-3xl text-center">
                <p className="text-emerald-700 font-medium mb-2">Taux d'intérêt fixe</p>
                <p className="text-7xl font-bold text-emerald-600">3.0 %</p>
              </div>

              <div className="mt-8 bg-zinc-900 text-white rounded-3xl p-12 text-center">
                <p className="text-zinc-400 text-lg">Mensualité estimée</p>
                <p className="text-7xl font-bold text-emerald-400 mt-3">{mensualite.toLocaleString('fr-FR')} €</p>
                <p className="text-zinc-500 mt-1">par mois</p>

                <div className="grid grid-cols-2 gap-10 mt-10 border-t border-zinc-700 pt-10">
                  <div>
                    <p className="text-zinc-400">Coût total</p>
                    <p className="text-3xl font-semibold mt-2">{coutTotal.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Intérêts</p>
                    <p className="text-3xl font-semibold text-orange-400 mt-2">{interets.toLocaleString('fr-FR')} €</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DEMANDE DE FINANCEMENT - VERSION STYLÉE */}
      <div id="demande" className="max-w-4xl mx-auto px-6 pb-24">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-[3.5rem]" />
          
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl relative">
            <CardHeader className="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 text-white py-16">
              <CardTitle className="text-5xl text-center font-bold tracking-tight">Demande de Financement</CardTitle>
              <CardDescription className="text-center text-emerald-100 text-xl mt-4">Étude personnalisée • Réponse sous 24h</CardDescription>
            </CardHeader>

            <CardContent className="p-14 space-y-12">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="text-7xl mb-6">🎉</div>
                  <p className="text-4xl font-semibold text-emerald-600">Demande bien reçue !</p>
                  <p className="text-zinc-600 mt-4 text-lg">Nous vous contacterons très rapidement.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div>
                    <Label className="text-lg mb-6 block text-zinc-700 font-medium">Vous êtes :</Label>
                    <div className="grid grid-cols-2 gap-6">
                      <Button
                        type="button"
                        onClick={() => setTypeClient("particulier")}
                        className={`py-9 text-lg font-semibold transition-all duration-300 rounded-3xl shadow-md ${typeClient === "particulier" ? "bg-emerald-600 text-white scale-105 shadow-emerald-600/40" : "bg-white border-2 border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50"}`}
                      >
                        Particulier
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setTypeClient("independant")}
                        className={`py-9 text-lg font-semibold transition-all duration-300 rounded-3xl shadow-md ${typeClient === "independant" ? "bg-emerald-600 text-white scale-105 shadow-emerald-600/40" : "bg-white border-2 border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50"}`}
                      >
                        Indépendant
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><Label>Prénom *</Label><Input name="prenom" required placeholder="Votre prénom" className="h-16 text-lg rounded-3xl" /></div>
                    <div className="space-y-3"><Label>Nom *</Label><Input name="nom" required placeholder="Votre nom" className="h-16 text-lg rounded-3xl" /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><Label>Téléphone *</Label><Input name="telephone" type="tel" required placeholder="06 XX XX XX XX" className="h-16 text-lg rounded-3xl" /></div>
                    <div className="space-y-3"><Label>Email *</Label><Input name="email" type="email" required placeholder="votre@email.com" className="h-16 text-lg rounded-3xl" /></div>
                  </div>

                  {typeClient === "particulier" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3"><Label>Revenu net mensuel (€)</Label><Input name="revenuOuCA" type="number" placeholder="2500" className="h-16 text-lg rounded-3xl" /></div>
                      <div className="space-y-3"><Label>Charges mensuelles (€)</Label><Input name="charges" type="number" placeholder="800" className="h-16 text-lg rounded-3xl" /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3"><Label>Chiffre d'affaires mensuel (€)</Label><Input name="revenuOuCA" type="number" placeholder="4500" className="h-16 text-lg rounded-3xl" /></div>
                      <div className="space-y-3"><Label>Charges professionnelles (€)</Label><Input name="charges" type="number" placeholder="1200" className="h-16 text-lg rounded-3xl" /></div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Message / Commentaires (optionnel)</Label>
                    <Textarea name="message" rows={6} placeholder="Décrivez votre projet ou votre situation..." className="text-lg rounded-3xl" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full py-9 text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-3xl transition-all hover:scale-[1.02] shadow-xl">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande de financement"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Pourquoi choisir Essor Crédit ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Réponse ultra-rapide", desc: "Votre dossier étudié en moins de 24 heures" },
              { icon: "🔒", title: "Sécurité maximale", desc: "Données protégées et conformes RGPD" },
              { icon: "🤝", title: "Accompagnement humain", desc: "Un conseiller dédié à votre projet" }
            ].map((item, i) => (
              <div key={i} className="text-center p-10 rounded-3xl hover:bg-zinc-50 transition-all">
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section id="avis" className="bg-zinc-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Ce que disent nos clients</h2>
          <p className="text-center text-zinc-600 mb-12">Plus de 12 450 personnes nous ont fait confiance</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sophie Martin", text: "J'ai obtenu mon prêt immobilier en moins d'une semaine." },
              { name: "Marc Dubois", text: "En tant qu'indépendant, le rachat de crédit a été très simple." },
              { name: "Laura Benali", text: "Accompagnement personnalisé et simulation très précise." }
            ].map((t, i) => (
              <Card key={i} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                <CardContent className="pt-8">
                  <div className="text-5xl text-emerald-200 mb-4">“</div>
                  <p className="text-lg leading-relaxed mb-6 text-gray-700">{t.text}</p>
                  <p className="font-semibold text-emerald-700">— {t.name}</p>
                </CardContent>
              </Card>
            ))}
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
          <p className="text-zinc-400">Votre partenaire de confiance pour tous vos projets financiers.</p>
          <div className="text-sm text-zinc-500 mt-8">
            © 2026 Essor Crédit - Tous droits réservés | IOBSP | ORIAS n° XXXXXXX
          </div>
        </div>
      </footer>
    </main>
  );
}