"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Landmark, Lock } from "lucide-react";

type WalletTransferAreaProps = {
  montantDisponible: number;
  activationRequired?: boolean;
  activationCodeExpected?: string;
  onTransferComplete?: () => void;
};

export default function WalletTransferArea({
  montantDisponible,
  activationRequired = true,
  activationCodeExpected = "95AEE4B7",
  onTransferComplete,
}: WalletTransferAreaProps) {
  const [step, setStep] = useState<"form" | "summary" | "activation" | "success">("form");

  const [transferData, setTransferData] = useState({
    amount: "",
    beneficiaryName: "",
    iban: "",
    bic: "",
    bankName: "",
    reason: "",
  });

  const [activationCode, setActivationCode] = useState("");
  const [transferError, setTransferError] = useState("");

  const handleContinue = () => {
    if (
      !transferData.amount ||
      !transferData.beneficiaryName ||
      !transferData.iban ||
      !transferData.bic ||
      !transferData.bankName
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStep("summary");
  };

  const handleActivation = () => {
    if (activationCode.trim().toUpperCase() !== activationCodeExpected) {
      setTransferError("Code d’activation invalide.");
      return;
    }

    setTransferError("");
    setStep("success");

    if (onTransferComplete) {
      onTransferComplete();
    }
  };

  return (
    <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Landmark className="w-6 h-6 text-emerald-300" />
          Centre de transfert bancaire
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === "form" && (
          <div className="space-y-4">
            <p className="text-zinc-300">
              Solde disponible :{" "}
              <span className="text-emerald-300 font-bold">
                {montantDisponible.toLocaleString("fr-FR")} €
              </span>
            </p>

            <Input
              placeholder="Montant"
              value={transferData.amount}
              onChange={(e) =>
                setTransferData({ ...transferData, amount: e.target.value })
              }
            />

            <Input
              placeholder="Nom du bénéficiaire"
              value={transferData.beneficiaryName}
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  beneficiaryName: e.target.value,
                })
              }
            />

            <Input
              placeholder="IBAN"
              value={transferData.iban}
              onChange={(e) =>
                setTransferData({ ...transferData, iban: e.target.value })
              }
            />

            <Input
              placeholder="BIC / SWIFT"
              value={transferData.bic}
              onChange={(e) =>
                setTransferData({ ...transferData, bic: e.target.value })
              }
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
            />

            <Input
              placeholder="Motif"
              value={transferData.reason}
              onChange={(e) =>
                setTransferData({ ...transferData, reason: e.target.value })
              }
            />

            <Button
              onClick={handleContinue}
              className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
            >
              Continuer
            </Button>
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-4">
            <p className="text-white font-semibold">
              Vérifiez les informations du virement :
            </p>

            <div className="bg-black/20 rounded-2xl p-4 space-y-2 text-sm">
              <p>Montant : {transferData.amount} €</p>
              <p>Bénéficiaire : {transferData.beneficiaryName}</p>
              <p>IBAN : {transferData.iban}</p>
              <p>BIC : {transferData.bic}</p>
              <p>Banque : {transferData.bankName}</p>
              <p>Motif : {transferData.reason || "—"}</p>
            </div>

            <Button
              onClick={() =>
                setStep(activationRequired ? "activation" : "success")
              }
              className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-2xl"
            >
              Confirmer
            </Button>
          </div>
        )}

        {step === "activation" && (
          <div className="space-y-4">
            <p className="text-white flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Entrez le code d’activation du virement
            </p>

            <Input
              placeholder="Code d’activation"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
            />

            {transferError && (
              <p className="text-red-400 text-sm">{transferError}</p>
            )}

            <Button
              onClick={handleActivation}
              className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-2xl"
            >
              Valider
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />

            <p className="text-2xl font-bold text-white">
              Transfert validé
            </p>

            <p className="text-zinc-400 mt-2">
              Votre transfert bancaire est maintenant en cours d’exécution.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}