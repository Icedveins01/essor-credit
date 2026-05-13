import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { iban } = await req.json();

    if (!iban || typeof iban !== "string") {
      return NextResponse.json(
        { success: false, error: "IBAN manquant." },
        { status: 400 }
      );
    }

    const cleanIban = iban.replace(/\s/g, "");

    const response = await fetch(
      `https://openiban.com/validate/${cleanIban}?getBIC=true&validateBankCode=true`
    );

    const data = await response.json();

    if (!data.valid) {
      return NextResponse.json({
        success: false,
        error: "IBAN invalide.",
      });
    }

    return NextResponse.json({
      success: true,
      bankName: data.bankData?.name || "",
      bic: data.bankData?.bic || "",
      country: data.bankData?.country || "",
      bankCode: data.bankData?.bankCode || "",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur IBAN.",
      },
      { status: 500 }
    );
  }
}