"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b z-50 py-6">  {/* py-5 → py-6 */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Essor Crédit</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#accueil" className="hover:text-emerald-600 transition-colors">Accueil</a>
          <a href="#simulateur" className="hover:text-emerald-600 transition-colors">Simulateur</a>
          <a href="#demande" className="hover:text-emerald-600 transition-colors">Demande de prêt</a>
          <a href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          <a href="/contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          <Link href="/espace-client" className="hover:text-emerald-600 transition-colors font-semibold text-emerald-600">
            Espace Client
          </Link>
        </nav>

        <Button asChild>
          <Link href="#demande">Faire une demande</Link>
        </Button>
      </div>
    </header>
  );
}