import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email manquant" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Aucun client trouvé avec cet email" },
        { status: 404 }
      );
    }

    const accessCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    await prisma.client.update({
      where: { email },
      data: {
        motDePasse: accessCode,
      },
    });

    return NextResponse.json({
      success: true,
      accessCode,
    });
  } catch (error) {
    console.error("Erreur reset access :", error);

    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}