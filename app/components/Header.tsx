"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">EC</div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">Essor Crédit</h1>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <Link href="/faire-demande" className="hover:text-emerald-600 transition-colors font-medium">Faire une demande</Link>
          <a href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          <a href="/contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          <Link href="/espace-client" className="font-semibold text-emerald-600">Espace Client</Link>
        </nav>

        <Button asChild className="hidden md:block">
          <Link href="/faire-demande">Faire une demande</Link>
        </Button>

        {/* Bouton Menu Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-zinc-700"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t py-8 px-6 space-y-6 text-lg font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block">Accueil</Link>
          <Link href="/faire-demande" onClick={() => setMenuOpen(false)} className="block">Faire une demande</Link>
          <a href="/faq" onClick={() => setMenuOpen(false)} className="block">FAQ</a>
          <a href="/contact" onClick={() => setMenuOpen(false)} className="block">Contact</a>
          <Link href="/espace-client" onClick={() => setMenuOpen(false)} className="block text-emerald-600 font-semibold">Espace Client</Link>
        </div>
      )}
    </header>
  );
}