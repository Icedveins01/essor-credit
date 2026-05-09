import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const demandesPath = path.join(process.cwd(), "data", "demandes.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

type UploadedFile = {
  name: string;
  url: string;
  uploadedAt: string;
};

function readDemandes(): any[] {
  try {
    const data = fs.readFileSync(demandesPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeDemandes(demandes: any[]) {
  fs.writeFileSync(demandesPath, JSON.stringify(demandes, null, 2));
}

function cleanFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createTimelineEvent(
  type: "created" | "status" | "document" | "comment" | "funding",
  title: string,
  description: string
) {
  return {
    id: `T-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const formData = await req.formData();

    const demandeId = formData.get("demandeId") as string;
    const type = formData.get("type") as "contract" | "justificatifs";
    const files = formData.getAll("files") as File[];

    if (!demandeId || !type || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }

    const demandes = readDemandes();
    const index = demandes.findIndex((d) => d.id === demandeId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Demande introuvable" },
        { status: 404 }
      );
    }

    if (!demandes[index].timeline) {
      demandes[index].timeline = [];
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${cleanFileName(file.name)}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      uploadedFiles.push({
        name: file.name,
        url: `/uploads/${fileName}`,
        uploadedAt: new Date().toISOString(),
      });
    }

    if (type === "contract") {
      demandes[index].signedContract = uploadedFiles[0];

      demandes[index].timeline.unshift(
        createTimelineEvent(
          "document",
          "Contrat signé déposé",
          `Le contrat signé a été ajouté au dossier : ${uploadedFiles[0].name}`
        )
      );
    }

    if (type === "justificatifs") {
      demandes[index].justificatifs = [
        ...(demandes[index].justificatifs || []),
        ...uploadedFiles,
      ];

      uploadedFiles.forEach((file) => {
        demandes[index].timeline.unshift(
          createTimelineEvent(
            "document",
            "Justificatif reçu",
            `Nouveau justificatif ajouté : ${file.name}`
          )
        );
      });
    }

    demandes[index].updatedAt = new Date().toISOString();

    writeDemandes(demandes);

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      demande: demandes[index],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Erreur upload serveur" },
      { status: 500 }
    );
  }
}