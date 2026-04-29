"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [montant, setMontant] = useState(150000);
  const [duree, setDuree] = useState(180);
  const [typeClient, setTypeClient] = useState<"particulier" | "independant">("particulier");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const TAUX_FIXE = 3.0;

  const mensualite = (() => {
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const nbMois = duree;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -nbMois));
    return Math.round(m * 100) / 100;
  })();

  const coutTotal = Math.round(mensualite * duree * 100) / 100;
  const interets = Math.round((coutTotal - montant) * 100) / 100;

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

    console.log("📤 Envoi POST vers /api/contact :", data);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("📥 Réponse API :", result);

      if (response.ok) {
        setSubmitted(true);
        alert("✅ Demande envoyée avec succès ! Nous vous contacterons sous 24h.");
      } else {
        alert("❌ Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert("❌ Impossible de contacter le serveur.");
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
            <a href="#simulateur" className="hover:text-emerald-600 transition-colors">Simulateur</a>
            <a href="#demande" className="hover:text-emerald-600 transition-colors">Demande</a>
            <a href="#avis" className="hover:text-emerald-600 transition-colors">Avis</a>
          </nav>

          <Button onClick={() => document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth' })}>
            Faire une demande
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#0A2540] text-white pt-28 pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 px-6 py-2.5 rounded-full text-sm">
            ⚡ Simulation gratuite en 2 minutes
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
            Votre essor financier<br />commence aujourd’hui
          </h1>

          <p className="text-2xl text-zinc-300 mb-12 max-w-3xl mx-auto">
            Prêts personnels • Crédit immobilier • Prêt auto • Solutions pour indépendants • Rachat de crédit
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-xl px-14 py-8 rounded-2xl" onClick={() => document.getElementById('simulateur')?.scrollIntoView({ behavior: 'smooth' })}>
              Faire ma simulation gratuite
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-14 py-8 border-2 border-white text-white hover:bg-white hover:text-[#0A2540] rounded-2xl" onClick={() => document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth' })}>
              Demander à être rappelé
            </Button>
          </div>
        </div>
      </section>

      {/* SIMULATEUR */}
      <div id="simulateur" className="max-w-4xl mx-auto px-6 py-20">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Simulateur de Prêt</CardTitle>
            <p className="text-center text-zinc-500">Taux fixe à 3%</p>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div>
              <div className="flex justify-between mb-4">
                <Label>Montant du prêt</Label>
                <span className="text-3xl font-bold text-emerald-600">{montant.toLocaleString('fr-FR')} €</span>
              </div>
              <input type="range" min={2000} max={1500000} step={5000} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <Label>Durée du remboursement</Label>
                <span className="text-2xl font-semibold">{Math.floor(duree / 12)} ans et {duree % 12} mois</span>
              </div>
              <input type="range" min={6} max={360} step={6} value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <p className="text-emerald-700 font-medium">Taux d'intérêt fixe</p>
              <p className="text-5xl font-bold text-emerald-600">3.0 %</p>
            </div>

            <div className="bg-zinc-900 text-white rounded-3xl p-10 text-center">
              <p className="text-zinc-400 mb-1">Mensualité estimée</p>
              <p className="text-6xl font-bold text-emerald-400">{mensualite.toLocaleString('fr-FR')} €</p>
              <p className="text-sm text-zinc-500 mb-8">par mois</p>

              <div className="grid grid-cols-2 gap-8 border-t border-zinc-700 pt-8">
                <div><p className="text-zinc-400 text-sm">Coût total</p><p className="text-2xl font-semibold">{coutTotal.toLocaleString('fr-FR')} €</p></div>
                <div><p className="text-zinc-400 text-sm">Intérêts</p><p className="text-2xl font-semibold text-orange-400">{interets.toLocaleString('fr-FR')} €</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FORMULAIRE */}
      <div id="demande" className="max-w-4xl mx-auto px-6 pb-24">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Demande de Financement</CardTitle>
            <CardDescription className="text-center">Étude personnalisée sous 24h</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            {submitted ? (
              <div className="text-center py-16">
                <p className="text-3xl font-semibold text-emerald-600 mb-4">✅ Demande bien reçue !</p>
                <p className="text-lg text-zinc-600">Nous vous contacterons dans les 24 heures.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label className="text-lg mb-4 block">Vous êtes :</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant={typeClient === "particulier" ? "default" : "outline"} onClick={() => setTypeClient("particulier")}>Particulier</Button>
                    <Button type="button" variant={typeClient === "independant" ? "default" : "outline"} onClick={() => setTypeClient("independant")}>Indépendant</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label>Prénom *</Label><Input name="prenom" required placeholder="Votre prénom" /></div>
                  <div><Label>Nom *</Label><Input name="nom" required placeholder="Votre nom" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label>Téléphone *</Label><Input name="telephone" type="tel" required placeholder="06 XX XX XX XX" /></div>
                  <div><Label>Email *</Label><Input name="email" type="email" required placeholder="votre@email.com" /></div>
                </div>

                {typeClient === "particulier" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><Label>Revenu net mensuel (€)</Label><Input name="revenuOuCA" type="number" placeholder="2500" /></div>
                    <div><Label>Charges mensuelles (€)</Label><Input name="charges" type="number" placeholder="800" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><Label>Chiffre d'affaires mensuel (€)</Label><Input name="revenuOuCA" type="number" placeholder="4500" /></div>
                    <div><Label>Charges professionnelles (€)</Label><Input name="charges" type="number" placeholder="1200" /></div>
                  </div>
                )}

                <div>
                  <Label>Message / Commentaires (optionnel)</Label>
                  <Textarea name="message" rows={5} placeholder="Décrivez votre projet..." />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-8 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-2xl">
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande de financement"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0A2540] text-white py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
            <p className="text-2xl font-bold">Essor Crédit</p>
          </div>
          <p className="text-zinc-400 mb-8">Votre partenaire de confiance pour tous vos projets financiers.</p>
          <div className="text-sm text-zinc-500 space-y-2">
            <p>© 2026 Essor Crédit - Tous droits réservés</p>
            <p>Intermédiaire en Opérations de Banque et Services de Paiement (IOBSP)</p>
          </div>
        </div>
      </footer>
    </main>
  );
}