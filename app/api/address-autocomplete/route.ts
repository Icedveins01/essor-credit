import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    suggestions: [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query || "";

    return NextResponse.json({
      success: true,
      query,
      suggestions: [],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur serveur adresse." },
      { status: 500 }
    );
  }
}