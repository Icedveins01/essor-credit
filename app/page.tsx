"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [montant, setMontant] = useState<number>(0);
  const [duree, setDuree] = useState<number>(0);
  const [typeClient, setTypeClient] = useState<"particulier" | "independant">("particulier");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const TAUX_FIXE = 3.0;

  const mensualite = (() => {
    if (montant <= 0 || duree < 6) return 0;
    const tauxMensuel = TAUX_FIXE / 100 / 12;
    const m = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return Math.round(m * 100) / 100;
  })();

  const coutTotal = duree >= 6 ? Math.round(mensualite * duree * 100) / 100 : 0;
  const interets = duree >= 6 ? Math.round((coutTotal - montant) * 100) / 100 : 0;

  const testimonials = [
    { name: "Sophie Martin", location: "Paris", text: "J'ai obtenu mon crédit immobilier en 8 jours seulement. Le simulateur était ultra précis." },
    { name: "Marc Dubois", location: "Lyon", text: "En tant qu'indépendant, le rachat de crédit a été très simple et avantageux." },
    { name: "Laura Benali", location: "Marseille", text: "Accompagnement humain et professionnel. Je recommande Essor Crédit à 100% !" },
    { name: "Thomas Leclerc", location: "Bordeaux", text: "Prêt auto obtenu en moins de 10 jours. Service rapide et efficace." },
    { name: "Tatjana Geissler", location: "Leipzig", text: "La simulation m'a permis de bien comparer les offres. Très satisfaite." },
    { name: "Julien Moreau", location: "Lille", text: "Rachat de crédit réussi avec un excellent taux. Merci à toute l'équipe !" },
    { name: "Anja Mueller", location: "Stuttgart", text: "Franchement je recommande à mille pour cent, on peut faire la demande les yeux fermés." },
    { name: "Pierre Lambert", location: "Strasbourg", text: "Impec système réactif. Argent très rapidement versé sur le compte !" },
    { name: "Camille Rousseau", location: "Nice", text: "Grâce au simulateur, j'ai pu visualiser clairement mes mensualités." },
    { name: "Karim Benali", location: "Montpellier", text: "Solution pour indépendant parfaite." },
    { name: "Élise Moreau", location: "Rennes", text: "Demande de prêt immobilier validée rapidement." },
    { name: "Antoine Dupuis", location: "Grenoble", text: "Très bon suivi tout au long du dossier." },
    { name: "Nadia Fournier", location: "Tours", text: "Rachat de crédit + prêt auto en même temps." },
    { name: "Lucas Bernard", location: "Dijon", text: "Simulateur très intuitif et résultats fiables." },
    { name: "Sarah Petit", location: "Le Havre", text: "Je vous exprime toute ma gratitude pour votre soutien..." },
    { name: "Mehdi Alami", location: "Aix-en-Provence", text: "En vue d'offrir une voiture à mon épouse..." },
    { name: "Isabelle Laurent", location: "Angers", text: "Service client au top." },
    { name: "Pauline Lefèvre", location: "Clermont-Ferrand", text: "Prêt personnel accordé rapidement." },
    { name: "Hans Udo", location: "Saarbrucken", text: "Demande de crédit faite en ligne avant hier soir..." },
    { name: "Marie Dubois", location: "Brest", text: "Je ne regrette pas d'avoir choisi Essor Crédit." }
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
      {/* HEADER AVEC NAVIGATION MISE À JOUR */}
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
            <a href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            <a href="/contact" className="hover:text-emerald-600 transition-colors">Contact</a>
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
            {/* Montant */}
            <div className="group">
              <div className="flex justify-between mb-3">
                <Label className="text-xl">Montant du prêt</Label>
                <span className="text-5xl font-bold text-emerald-600">{montant.toLocaleString('fr-FR')} €</span>
              </div>
              <input type="range" min={2000} max={1500000} step={5000} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-emerald-600 mb-4" />
              <Input type="number" value={montant || ""} onChange={(e) => setMontant(Number(e.target.value) || 0)} className="no-spinner text-center text-4xl font-semibold h-20 rounded-3xl border-2 border-zinc-200 focus:border-emerald-600" placeholder="Entrez le montant souhaité" />
            </div>

            {/* Durée */}
            <div className="group">
              <div className="flex justify-between mb-3">
                <Label className="text-xl">Durée du remboursement souhaité</Label>
                <span className="text-4xl font-semibold">{duree >= 6 ? `${Math.floor(duree / 12)} ans et ${duree % 12} mois` : ""}</span>
              </div>
              <input type="range" min={6} max={360} step={6} value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full accent-emerald-600 mb-4" />
              <Input type="number" value={duree || ""} onChange={(e) => setDuree(Number(e.target.value) || 0)} onBlur={() => { if (duree < 6) setDuree(6); if (duree > 360) setDuree(360); }} className="no-spinner text-center text-4xl font-semibold h-20 rounded-3xl border-2 border-zinc-200 focus:border-emerald-600" placeholder="Nombre de mois (ex: 180)" />
            </div>

            {/* Résultats */}
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
                  <div><p className="text-zinc-400">Coût total</p><p className="text-3xl font-semibold mt-2">{coutTotal.toLocaleString('fr-FR')} €</p></div>
                  <div><p className="text-zinc-400">Intérêts</p><p className="text-3xl font-semibold text-orange-400 mt-2">{interets.toLocaleString('fr-FR')} €</p></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DEMANDE DE FINANCEMENT */}
      <div id="demande" className="max-w-4xl mx-auto px-6 pb-24">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-[3.5rem]" />
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
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
                      <Button type="button" onClick={() => setTypeClient("particulier")} className={`py-9 text-lg font-semibold transition-all duration-300 rounded-3xl shadow-md ${typeClient === "particulier" ? "bg-emerald-600 text-white scale-105 shadow-emerald-600/40" : "bg-white border-2 border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50"}`}>Particulier</Button>
                      <Button type="button" onClick={() => setTypeClient("independant")} className={`py-9 text-lg font-semibold transition-all duration-300 rounded-3xl shadow-md ${typeClient === "independant" ? "bg-emerald-600 text-white scale-105 shadow-emerald-600/40" : "bg-white border-2 border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50"}`}>Indépendant</Button>
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

      {/* TÉMOIGNAGES SLIDER */}
      <section id="avis" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Ils nous ont fait confiance</h2>
            <p className="text-xl text-zinc-600">Plus de 12 450 clients satisfaits</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {testimonials.map((t, i) => (
                  <div key={i} className="min-w-full px-6">
                    <Card className="border-0 h-full">
                      <CardContent className="pt-12 pb-12 px-12 text-center">
                        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-inner mb-8">
                          <div className="text-6xl text-gray-500">👤</div>
                        </div>
                        <div className="text-6xl text-emerald-200 mb-6">“</div>
                        <p className="text-xl leading-relaxed text-gray-700 mb-10">{t.text}</p>
                        <div>
                          <p className="font-semibold text-emerald-700 text-2xl">{t.name}</p>
                          <p className="text-zinc-500 text-lg">{t.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-4">
              <ChevronLeft className="w-7 h-7" />
            </Button>
            <Button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-4">
              <ChevronRight className="w-7 h-7" />
            </Button>

            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-4 h-4 rounded-full transition-all ${currentSlide === i ? 'bg-emerald-600 scale-125' : 'bg-zinc-300'}`} />
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
          <p className="text-zinc-400">Votre partenaire de confiance pour tous vos projets financiers.</p>
        </div>
      </footer>
    </main>
  );
}