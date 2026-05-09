"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Clock,
  Headphones,
} from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.10),_transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-6 py-3 mb-8">
            <Headphones className="w-4 h-4 text-emerald-300" />
            <span className="text-sm text-zinc-300">Assistance premium</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Contactez-nous
          </h1>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Une question sur votre demande, votre simulation ou votre espace
            client ? Notre équipe vous accompagne.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
            <CardContent className="p-8 md:p-10">
              <h2 className="text-3xl font-semibold mb-8">
                Envoyez-nous un message
              </h2>

              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="h-14 rounded-2xl bg-white/10 border border-white/10 px-5 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400"
                  />

                  <input
                    type="text"
                    placeholder="Nom"
                    className="h-14 rounded-2xl bg-white/10 border border-white/10 px-5 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="h-14 w-full rounded-2xl bg-white/10 border border-white/10 px-5 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400"
                />

                <input
                  type="tel"
                  placeholder="Téléphone"
                  className="h-14 w-full rounded-2xl bg-white/10 border border-white/10 px-5 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400"
                />

                <textarea
                  placeholder="Votre message..."
                  rows={6}
                  className="w-full rounded-3xl bg-white/10 border border-white/10 p-5 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-400"
                />

                <Button
                  type="button"
                  className="w-full h-16 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Envoyer le message
                </Button>

                <p className="text-xs text-zinc-500 text-center">
                  Ce formulaire est visuel. Pour recevoir réellement les
                  messages, il faudra ensuite connecter une API email.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-5 space-y-5">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-white/5 border-white/10 rounded-[2rem]">
              <CardContent className="p-8">
                <ShieldCheck className="w-10 h-10 text-emerald-300 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">
                  Suivi sécurisé
                </h3>
                <p className="text-zinc-400">
                  Pour un dossier déjà créé, connectez-vous à votre espace
                  client afin de suivre l’avancement et transmettre vos
                  documents.
                </p>

                <a
                  href="/espace-client"
                  className="inline-flex mt-7 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
                >
                  Accéder à mon espace client
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/7 border-white/10 rounded-[2rem]">
              <CardContent className="p-8 space-y-7">
                <h3 className="text-2xl font-semibold">Nos coordonnées</h3>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-zinc-400">
                      Indiquez ici votre adresse officielle
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-zinc-400">
                      Indiquez ici votre numéro officiel
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-emerald-300">
                      contact@essor-credit.fr
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-zinc-400">
                      Du lundi au vendredi, 9h - 18h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <a
              href="https://wa.me/33600000000"
              target="_blank"
              className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              Contacter via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}