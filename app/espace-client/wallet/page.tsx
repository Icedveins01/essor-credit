"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "../../components/Header";
import {
  ArrowLeft,
  ShieldCheck,
  Landmark,
  CheckCircle,
  AlertTriangle,
  Download,
  Lock,
} from "lucide-react";

export default function WalletPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferError, setTransferError] = useState("");

  

  const detectBankName = (iban: string, bic: string) => {
    const clean = iban.replace(/\s/g, "").toUpperCase();
    const cleanBic = bic.toUpperCase();
    const country = clean.slice(0, 2);

    if (cleanBic.includes("SALADE")) return "Sparkasse";
    if (cleanBic.includes("COBADE")) return "Commerzbank";
    if (cleanBic.includes("DEUTDE")) return "Deutsche Bank";
    if (cleanBic.includes("GENODE")) return "Volksbank / Raiffeisenbank";
    if (cleanBic.includes("NTSBDE")) return "N26 Bank";
    if (cleanBic.includes("BYLADEM")) return "BayernLB";

    if (cleanBic.includes("BNPAFR")) return "BNP Paribas";
    if (cleanBic.includes("SOGEFR")) return "Société Générale";
    if (cleanBic.includes("AGRIFR")) return "Crédit Agricole";
    if (cleanBic.includes("CCBPFR")) return "Banque Populaire";
    if (cleanBic.includes("CMCIFR")) return "Crédit Mutuel";

    if (cleanBic.includes("BBVAES")) return "BBVA";
    if (cleanBic.includes("CAIXES")) return "CaixaBank";
    if (cleanBic.includes("BSCHES")) return "Santander";

    if (cleanBic.includes("BCITIT")) return "Intesa Sanpaolo";
    if (cleanBic.includes("UNCRIT")) return "UniCredit";

    if (cleanBic.includes("GKCCBE")) return "Belfius";
    if (cleanBic.includes("BBRUBE")) return "ING Belgique";

    if (cleanBic.includes("CELLLULL")) return "Spuerkeess";
    if (cleanBic.includes("BILLLULL"))
      return "Banque Internationale à Luxembourg";

    if (cleanBic.includes("UBSWCH")) return "UBS";
    if (cleanBic.includes("POFICH")) return "PostFinance";

    if (cleanBic.includes("BARCGB")) return "Barclays";
    if (cleanBic.includes("LOYDGB")) return "Lloyds Bank";

    if (cleanBic.includes("REVOLT")) return "Revolut";
    if (cleanBic.includes("TRWIBEB")) return "Wise";
    if (cleanBic.includes("PAYPAL")) return "PayPal";

    switch (country) {
      case "DE":
        return "Banque allemande";
      case "FR":
        return "Banque française";
      case "ES":
        return "Banque espagnole";
      case "IT":
        return "Banque italienne";
      case "BE":
        return "Banque belge";
      case "LU":
        return "Banque luxembourgeoise";
      case "CH":
        return "Banque suisse";
      case "GB":
        return "Banque britannique";
      default:
        return "";
    }
  };

  const montantDisponible = useMemo(() => {
    if (typeof window === "undefined") return 0;

    try {
      const savedDemande = sessionStorage.getItem("selectedDemande");
      if (!savedDemande) return 0;

      const demande = JSON.parse(savedDemande);
      return Number(demande?.montant || 0);
    } catch {
      return 0;
    }
  }, []);

  const demandeReference = useMemo(() => {
  if (typeof window === "undefined") return "—";

  try {
    const savedDemande = sessionStorage.getItem("selectedDemande");
    if (!savedDemande) return "—";

    const demande = JSON.parse(savedDemande);
    return demande?.id || "—";
  } catch {
    return "—";
  }
}, []);

const stopPercent = useMemo(() => {
  if (typeof window === "undefined") return 100;

  const saved = sessionStorage.getItem(
    `adminTransferStopPercent_${demandeReference}`
  );

  const value = Number(saved || 100);

  if (Number.isNaN(value)) return 100;

  return Math.min(Math.max(value, 0), 100);
}, [demandeReference]);

const expectedCode = useMemo(() => {
  if (typeof window === "undefined") return "95AEE4B7";

  return (
    sessionStorage.getItem(`adminActivationCode_${demandeReference}`) ||
    "95AEE4B7"
  );
}, [demandeReference]);

  const transferReference = useMemo(() => {
    return `TRF-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }, []);

  const [transferData, setTransferData] = useState({
    beneficiaryName: "",
    iban: "",
    bic: "",
    bankName: "",
    reason: "",
  });

  const cleanIban = transferData.iban.replace(/\s/g, "").toUpperCase();

  const isIbanValid =
    cleanIban.length >= 15 &&
    cleanIban.length <= 34 &&
    /^[A-Z]{2}[0-9A-Z]+$/.test(cleanIban);

  const progress = transferConfirmed
    ? 100
    : step === 1
    ? 33
    : step === 2
    ? 66
    : 90;

  const updateBankAuto = (ibanValue: string, bicValue: string) => {
    const detectedBank = detectBankName(ibanValue, bicValue);

    setTransferData((prev) => ({
      ...prev,
      iban: ibanValue,
      bic: bicValue,
      bankName: detectedBank || prev.bankName,
    }));
  };

  const handleContinue = () => {
    if (
      !transferData.beneficiaryName ||
      !transferData.iban ||
      !transferData.bankName
    ) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (!isIbanValid) {
      setError("IBAN invalide ou incomplet.");
      return;
    }

    setError("");
    setStep(2);
  };

  const saveTransferSuccess = () => {
    const receiptData = {
      dossierReference: demandeReference,
      transferReference,
      amount: montantDisponible,
      beneficiaryName: transferData.beneficiaryName,
      iban: cleanIban,
      bic: transferData.bic,
      bankName: transferData.bankName,
      reason: transferData.reason,
      date: new Date().toISOString(),
      status: "confirmed",
    };

    sessionStorage.setItem("lastTransferReceipt", JSON.stringify(receiptData));
    sessionStorage.setItem("walletTransferCompleted", "true");
    sessionStorage.setItem("walletTransferredDemandeId", demandeReference);

    setIsProcessing(false);
    setTransferConfirmed(true);
    setTransferProgress(100);
  };

  const confirmTransfer = () => {
    if (activationCode.trim().toUpperCase() !== expectedCode) {
      setError("Code d’activation incorrect ou non reconnu.");
      return;
    }

    setError("");
    setTransferError("");
    setIsProcessing(true);
    setTransferConfirmed(false);
    setTransferProgress(0);
    setStep(3);

    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 7) + 3;

      if (currentProgress >= stopPercent && stopPercent < 100) {
        currentProgress = stopPercent;
        setTransferProgress(currentProgress);
        clearInterval(interval);
        setIsProcessing(false);
        setTransferError(
          "Le transfert n’a pas pu être finalisé automatiquement. Une validation complémentaire est requise par le service financier."
        );
        return;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        setTransferProgress(100);
        clearInterval(interval);
        saveTransferSuccess();
        return;
      }

      setTransferProgress(currentProgress);
    }, 300);
  };

  const downloadReceipt = () => {
    const receipt = {
      referenceDossier: demandeReference,
      referenceTransfert: transferReference,
      montant: `${montantDisponible.toLocaleString("fr-FR")} €`,
      beneficiaire: transferData.beneficiaryName,
      iban: cleanIban,
      bic: transferData.bic || "—",
      banque: transferData.bankName,
      motif: transferData.reason || "—",
      date: new Date().toLocaleString("fr-FR"),
      statut: "Confirmé",
    };

    const content = `
REÇU DE TRANSFERT

Référence dossier : ${receipt.referenceDossier}
Référence transfert : ${receipt.referenceTransfert}
Montant : ${receipt.montant}

Bénéficiaire : ${receipt.beneficiaire}
IBAN : ${receipt.iban}
BIC / SWIFT : ${receipt.bic}
Banque : ${receipt.banque}
Motif : ${receipt.motif}

Date : ${receipt.date}
Statut : ${receipt.statut}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `recu-transfert-${transferReference}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

    return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98122,transparent_35%),radial-gradient(circle_at_bottom_right,#2563eb22,transparent_40%)]" />

      <Header />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        <Link href="/espace-client">
          <Button className="mb-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour à l’espace client
          </Button>
        </Link>

        <Card className="bg-indigo-500/10 border border-indigo-400/30 backdrop-blur-2xl rounded-[2rem] overflow-hidden mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Landmark className="w-6 h-6 text-indigo-300" />
              Espace de transfert sécurisé
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
              <p className="text-sm text-indigo-300 font-medium">
                Montant disponible
              </p>

              <p className="text-5xl font-bold mt-3">
                {montantDisponible.toLocaleString("fr-FR")} €
              </p>

              <p className="text-sm text-zinc-400 mt-3">
                Référence dossier :{" "}
                <span className="font-mono text-zinc-200">
                  {demandeReference}
                </span>
              </p>

              <p className="text-sm text-zinc-500 mt-2">
                Référence transfert :{" "}
                <span className="font-mono text-zinc-300">
                  {transferReference}
                </span>
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>Coordonnées</span>
                <span>Validation</span>
                <span>Confirmation</span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && !transferConfirmed && (
          <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                Coordonnées bénéficiaire
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="Nom du bénéficiaire"
                value={transferData.beneficiaryName}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    beneficiaryName: e.target.value,
                  })
                }
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              <Input
                placeholder="IBAN"
                value={transferData.iban}
                onChange={(e) =>
                  updateBankAuto(e.target.value.toUpperCase(), transferData.bic)
                }
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              {transferData.iban && (
                <div
                  className={`rounded-2xl p-4 text-sm border flex items-center gap-2 ${
                    isIbanValid
                      ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
                      : "bg-amber-500/10 border-amber-400/20 text-amber-300"
                  }`}
                >
                  {isIbanValid ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {isIbanValid
                    ? "IBAN vérifié visuellement"
                    : "IBAN incomplet ou invalide"}
                </div>
              )}

              <Input
                placeholder="BIC / SWIFT"
                value={transferData.bic}
                onChange={(e) =>
                  updateBankAuto(transferData.iban, e.target.value.toUpperCase())
                }
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              <Input
                placeholder="Nom de la banque"
                value={transferData.bankName}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    bankName: e.target.value,
                  })
                }
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              {transferData.bankName && (
                <div className="rounded-2xl p-4 text-sm border flex items-center gap-2 bg-emerald-500/10 border-emerald-400/20 text-emerald-300">
                  <CheckCircle className="w-4 h-4" />
                  Banque détectée : {transferData.bankName}
                </div>
              )}

              <Input
                placeholder="Motif du transfert"
                value={transferData.reason}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    reason: e.target.value,
                  })
                }
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              {error && (
                <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleContinue}
                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-lg"
              >
                Continuer vers la validation
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && !transferConfirmed && (
          <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-emerald-300" />
                Validation du transfert
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Bénéficiaire</p>
                  <p className="font-semibold mt-2">
                    {transferData.beneficiaryName}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Montant</p>
                  <p className="font-semibold mt-2">
                    {montantDisponible.toLocaleString("fr-FR")} €
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">IBAN</p>
                  <p className="font-mono text-sm mt-2 break-all">
                    {cleanIban}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Banque</p>
                  <p className="font-semibold mt-2">
                    {transferData.bankName}
                  </p>
                </div>
              </div>

              <Input
                placeholder="Code d’activation"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                className="h-14 bg-black/20 border-white/10 text-white rounded-2xl"
              />

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-2xl p-4">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={confirmTransfer}
                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-lg"
              >
                Confirmer le transfert
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && isProcessing && (
          <Card className="bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-2xl rounded-[2rem]">
            <CardContent className="p-10 text-center space-y-6">
              <p className="text-2xl font-semibold">
                Exécution du virement bancaire sécurisé…
              </p>

              <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${transferProgress}%` }}
                />
              </div>

              <p className="text-4xl font-bold text-emerald-300">
                {transferProgress}%
              </p>

              <p className="text-zinc-400">
                Le délai de réception dépend de la banque bénéficiaire. Si elle
                accepte les virements instantanés, la réception peut être rapide.
                Sinon, le délai peut dépendre du traitement bancaire standard.
              </p>
            </CardContent>
          </Card>
        )}

        {transferError && (
          <Card className="bg-red-500/10 border border-red-400/30 backdrop-blur-2xl rounded-[2rem] mt-6">
            <CardContent className="p-6 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-300 shrink-0 mt-1" />
              <div>
                <p className="text-red-300 font-semibold">
                  Transfert interrompu à {transferProgress}%
                </p>
                <p className="text-sm text-zinc-300 mt-2">{transferError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {transferConfirmed && (
          <Card className="bg-green-500/10 border border-green-400/30 backdrop-blur-2xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                Transfert confirmé
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                <p className="text-sm text-green-300 font-semibold">
                  Décaissement validé
                </p>

                <p className="text-4xl font-bold mt-3">
                  {montantDisponible.toLocaleString("fr-FR")} €
                </p>

                <p className="text-sm text-zinc-300 mt-3">
                  Le virement a été confirmé à 100%. Le délai de réception
                  dépend de la banque bénéficiaire et de son traitement des
                  virements instantanés ou standards.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Référence</p>
                  <p className="font-mono text-white mt-2">
                    {transferReference}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Statut</p>
                  <p className="text-emerald-300 font-semibold mt-2">
                    Confirmé à 100%
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                  <p className="text-sm text-zinc-400">Justificatif</p>
                  <p className="text-white font-semibold mt-2">Disponible</p>
                </div>
              </div>

              <Button
                onClick={downloadReceipt}
                className="w-full h-12 rounded-2xl bg-white text-black hover:bg-zinc-200"
              >
                <Download className="mr-2 w-4 h-4" />
                Télécharger le reçu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}