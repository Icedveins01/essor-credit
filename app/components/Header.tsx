"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/faire-demande", label: "Faire une demande" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/espace-client", label: "Espace Client" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20"
          >
            EC
          </motion.div>

          <div>
            <p className="font-bold text-xl tracking-tight text-white">
              Essor Crédit
            </p>
            <p className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              Espace sécurisé
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full p-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full transition-all ${
                isActive(link.href)
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/espace-client">Connexion</Link>
          </Button>

          <Button
            asChild
            className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          >
            <Link href="/faire-demande">Faire une demande</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#050816]/95 backdrop-blur-2xl px-6 py-5">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-2xl transition ${
                  isActive(link.href)
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button
            asChild
            className="w-full mt-5 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600"
          >
            <Link href="/faire-demande" onClick={() => setOpen(false)}>
              Faire une demande
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}