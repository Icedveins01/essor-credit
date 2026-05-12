import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function cleanFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const demandeId = formData.get("demandeId") as string;
    const type = formData.get("type") as
      | "contract_to_sign"
      | "signed_contract"
      | "justificatifs";

    const files = formData.getAll("files") as File[];

    if (!demandeId || !type || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }

    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
    });

    if (!demande) {
      return NextResponse.json(
        { success: false, error: "Demande introuvable" },
        { status: 404 }
      );
    }

    const uploadedFiles = [];
    const bucket = process.env.SUPABASE_BUCKET || "documents";

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${cleanFileName(file.name)}`;
      const storagePath = `${demandeId}/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Erreur Supabase upload :", uploadError);
        return NextResponse.json(
          { success: false, error: uploadError.message },
          { status: 500 }
        );
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

      const document = await prisma.document.create({
        data: {
          demandeId,
          nom: file.name,
          url: data.publicUrl,
          type,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          demandeId,
          titre:
            type === "contract_to_sign"
              ? "Contrat à signer déposé"
              : type === "signed_contract"
              ? "Contrat signé reçu"
              : "Justificatif ajouté",
          description:
            type === "contract_to_sign"
              ? `Le contrat à signer a été ajouté au dossier : ${file.name}`
              : type === "signed_contract"
              ? `Le contrat signé a été reçu : ${file.name}`
              : `Nouveau justificatif ajouté au dossier : ${file.name}`,
        },
      });

      uploadedFiles.push({
        id: document.id,
        name: document.nom,
        url: document.url,
        type: document.type,
        uploadedAt: document.uploadedAt.toISOString(),
      });
    }

    if (type === "signed_contract") {
      await prisma.demande.update({
        where: { id: demandeId },
        data: {
          statut: "Documents reçus",
        },
      });
    }

    if (type === "contract_to_sign") {
      await prisma.demande.update({
        where: { id: demandeId },
        data: {
          statut: "Accepté",
        },
      });
    }

    const updatedDemande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: {
        client: true,
        documents: true,
        timeline: true,
      },
    });

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      demande: updatedDemande,
    });
  } catch (error) {
    console.error("Erreur upload serveur :", error);

    return NextResponse.json(
      { success: false, error: "Erreur upload serveur" },
      { status: 500 }
    );
  }
}