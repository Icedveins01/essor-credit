import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email ou code manquant" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client || client.motDePasse !== password) {
      return NextResponse.json(
        { success: false, error: "Email ou code d’accès incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        email: client.email,
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone || "",
        sexe: client.sexe || "",
      },
    });
  } catch (error) {
    console.error("Erreur login client :", error);

    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}