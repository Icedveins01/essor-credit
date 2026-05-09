import type { Metadata } from "next";
import "./globals.css";
import "./three-fix";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Essor Crédit | Banque Privée Digitale & Financement Premium",
  description:
    "Essor Crédit - Solutions de financement premium : prêt personnel, immobilier, auto, professionnel et rachat de crédits avec expérience bancaire haut de gamme.",
  keywords: [
    "crédit",
    "prêt personnel",
    "prêt immobilier",
    "rachat de crédit",
    "financement premium",
    "banque privée",
    "Essor Crédit",
  ],
  authors: [{ name: "Essor Crédit" }],
  creator: "Essor Crédit",
  publisher: "Essor Crédit",
  metadataBase: new URL("https://www.essor-credit.com"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Essor Crédit | Financement Premium",
    description:
      "Une nouvelle génération de financement digital premium avec expérience bancaire privée.",
    url: "https://www.essor-credit.com",
    siteName: "Essor Crédit",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Essor Crédit | Banque Privée Digitale",
    description:
      "Solutions de financement premium et accompagnement haut de gamme.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased bg-[#030712] text-white selection:bg-emerald-500 selection:text-white overflow-x-hidden">
        {/* Background global premium */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.08),_transparent_35%),linear-gradient(to_bottom,_#020617,_#0A1428,_#020617)]" />

        {/* Glow décoratif */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-emerald-500/10 blur-3xl rounded-full -z-10" />

        <Header />

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}