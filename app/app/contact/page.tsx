// app/contact/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-zinc-600">Nous sommes à votre écoute</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <Card className="shadow-xl border-0">
            <CardContent className="p-10">
              <h2 className="text-2xl font-semibold mb-8">Envoyez-nous un message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" placeholder="Prénom" className="h-14 rounded-2xl border border-zinc-200 px-5" />
                  <input type="text" placeholder="Nom" className="h-14 rounded-2xl border border-zinc-200 px-5" />
                </div>
                <input type="email" placeholder="Email" className="h-14 w-full rounded-2xl border border-zinc-200 px-5" />
                <input type="tel" placeholder="Téléphone" className="h-14 w-full rounded-2xl border border-zinc-200 px-5" />
                <textarea placeholder="Votre message..." rows={6} className="w-full rounded-3xl border border-zinc-200 p-5" />
                <Button className="w-full py-8 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-2xl">
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-10 pt-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Nos coordonnées</h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="text-3xl">📍</div>
                  <div>
                    <p className="font-medium">Siège social</p>
                    <p className="text-zinc-600">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="text-3xl">📞</div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-zinc-600">01 76 36 00 00</p>
                    <p className="text-sm text-emerald-600">Du lundi au vendredi 9h - 19h</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-emerald-600">contact@essor-credit.fr</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-emerald-50 border-emerald-100">
              <p className="text-emerald-800">
                En tant qu’<strong>Intermédiaire en Opérations de Banque et Services de Paiement (IOBSP)</strong>, nous sommes enregistrés à l’ORIAS.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}