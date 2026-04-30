import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";   // ← Import du Header

export const metadata: Metadata = {
  title: "Essor Crédit - Simulation & Demande de Prêt",
  description: "Prêts personnels, crédit immobilier, prêt auto, rachat de crédit - Taux fixe 3%",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}