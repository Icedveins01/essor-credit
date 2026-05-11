import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Accès refusé" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}