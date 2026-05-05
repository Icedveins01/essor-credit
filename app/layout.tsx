import type { Metadata } from "next";
import "./globals.css";
import "./three-fix";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Essor Crédit - Simulation & Demande de Prêt",
  description: "Prêts personnels, crédit immobilier, prêt auto, rachat de crédit - Taux fixe 3%",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-zinc-50">
        <Header />
        {children}
      </body>
    </html>
  );
}