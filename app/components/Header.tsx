"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Essor Crédit</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#accueil" className="hover:text-emerald-600 transition-colors">Accueil</a>
          <a href="#simulateur" className="hover:text-emerald-600 transition-colors">Simulateur</a>
          <a href="#demande" className="hover:text-emerald-600 transition-colors">Demande</a>
          <a href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          <a href="/contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          <Link href="/espace-client" className="font-semibold text-emerald-600">Espace Client</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:block">
            <Link href="#demande">Faire une demande</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t py-6 px-6 space-y-6">
          <a href="#accueil" className="block text-lg" onClick={() => setMenuOpen(false)}>Accueil</a>
          <a href="#simulateur" className="block text-lg" onClick={() => setMenuOpen(false)}>Simulateur</a>
          <a href="#demande" className="block text-lg" onClick={() => setMenuOpen(false)}>Demande de prêt</a>
          <a href="/faq" className="block text-lg" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="/contact" className="block text-lg" onClick={() => setMenuOpen(false)}>Contact</a>
          <Link href="/espace-client" className="block text-lg font-semibold text-emerald-600" onClick={() => setMenuOpen(false)}>
            Espace Client
          </Link>
          
          <Button asChild className="w-full mt-4">
            <Link href="#demande">Faire une demande</Link>
          </Button>
        </div>
      )}
    </header>
  );
}