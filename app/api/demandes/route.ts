import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Statut = "En cours" | "Accepté" | "Refusé";

type TimelineEvent = {
  id: string;
  type: "created" | "status" | "document" | "comment" | "funding";
  title: string;
  description: string;
  createdAt: string;
};

const filePath = path.join(process.cwd(), "data", "demandes.json");

async function readDemandes() {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file);
  } catch {
    return [];
  }
}

async function saveDemandes(demandes: any[]) {
  await fs.writeFile(filePath, JSON.stringify(demandes, null, 2), "utf-8");
}

function createTimelineEvent(
  type: TimelineEvent["type"],
  title: string,
  description: string
): TimelineEvent {
  return {
    id: `T-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
}

export async function GET() {
  const demandes = await readDemandes();
  return NextResponse.json(demandes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const demandes = await readDemandes();

    const now = new Date().toISOString();

    const nouvelleDemande = {
      id: "D-" + Date.now().toString().slice(-8),
      createdAt: now,
      updatedAt: now,

      type: body.type,
      montant: Number(body.montant),
      duree: Number(body.duree),
      mensualite: Number(body.mensualite),

      coutTotal: body.coutTotal,
      interets: body.interets,

      statut: "En cours" as Statut,
      commentaire: "",

      isIndependant: body.isIndependant || false,
      typeClient: body.typeClient || "",

      message: body.message || "",

      signedContract: undefined,
      justificatifs: [],

      client: {
        prenom: body.prenom || "",
        nom: body.nom || "",
        email: body.clientEmail || body.email || "",
        telephone: body.telephone || "",
        adresse: body.adresse || "",
        ville: body.ville || "",
        pays: body.pays || "",
        typeClient: body.typeClient || "",
      },

      timeline: [
        createTimelineEvent(
          "created",
          "Demande créée",
          "Votre demande de financement a été enregistrée avec succès."
        ),
      ],
    };

    demandes.unshift(nouvelleDemande);

    await saveDemandes(demandes);

    return NextResponse.json({
      success: true,
      demande: nouvelleDemande,
    });
  } catch (error) {
    console.error("Erreur POST demandes :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, statut, commentaire, timelineEvent } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID manquant",
        },
        { status: 400 }
      );
    }

    const demandes = await readDemandes();

    const index = demandes.findIndex((d: any) => d.id === id);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Demande introuvable",
        },
        { status: 404 }
      );
    }

    const demande = demandes[index];

    if (!demande.timeline) {
      demande.timeline = [];
    }

    const oldStatut = demande.statut;
    const oldCommentaire = demande.commentaire || "";

    if (timelineEvent) {
      demande.timeline.unshift({
        id: `T-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: timelineEvent.type || "status",
        title: timelineEvent.title || "Mise à jour du dossier",
        description:
          timelineEvent.description || "Votre dossier a reçu une mise à jour.",
        createdAt: new Date().toISOString(),
      });
    }

    if (statut && statut !== oldStatut) {
      demande.statut = statut;

      if (!timelineEvent) {
        demande.timeline.unshift(
          createTimelineEvent(
            "status",
            statut === "Accepté"
              ? "Décision favorable"
              : statut === "Refusé"
              ? "Décision défavorable"
              : "Dossier en analyse",
            statut === "Accepté"
              ? "Votre demande a été acceptée par notre service."
              : statut === "Refusé"
              ? "Votre demande n’a pas été retenue après analyse."
              : "Votre dossier est actuellement en cours d’analyse."
          )
        );
      }
    }

    if (commentaire !== undefined && commentaire !== oldCommentaire) {
      demande.commentaire = commentaire;

      if (commentaire.trim() !== "" && !timelineEvent) {
        demande.timeline.unshift(
          createTimelineEvent("comment", "Message conseiller", commentaire)
        );
      }
    }

    demande.updatedAt = new Date().toISOString();

    demandes[index] = demande;

    await saveDemandes(demandes);

    return NextResponse.json({
      success: true,
      demande,
    });
  } catch (error) {
    console.error("Erreur PATCH demandes :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}