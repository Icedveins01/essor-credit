import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Statut =
  | "En cours"
  | "Documents reçus"
  | "Vérification finale"
  | "Accepté"
  | "Décaissement en préparation"
  | "Fonds mis à disposition"
  | "Fonds transférés"
  | "Refusé";

function formatFile(doc: any) {
  return {
    name: doc.nom,
    url: doc.url,
    uploadedAt: doc.uploadedAt.toISOString(),
  };
}

function formatDocuments(documents: any[] = []) {
  const sortedDocuments = [...documents].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const contractToSign = sortedDocuments.find(
    (doc) => doc.type === "contract_to_sign"
  );

  const signedContract = sortedDocuments.find(
    (doc) => doc.type === "signed_contract"
  );

  const justificatifs = sortedDocuments
    .filter((doc) => doc.type === "justificatifs")
    .map(formatFile);

  return {
    contractToSign: contractToSign ? formatFile(contractToSign) : undefined,
    signedContract: signedContract ? formatFile(signedContract) : undefined,
    justificatifs,
  };
}

function formatDemande(d: any, commentaire = "") {
  const docs = formatDocuments(d.documents || []);

  return {
    id: d.id,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt?.toISOString?.() || d.createdAt.toISOString(),
    type: d.typePret,
    montant: d.montant,
    duree: d.duree,
    mensualite: d.mensualite,
    coutTotal: d.coutTotal,
    interets: d.interets,
    statut: d.statut as Statut,
    commentaire,
    isIndependant: false,
    typeClient: "",
    message: "",

    contractToSign: docs.contractToSign,
    signedContract: docs.signedContract,
    justificatifs: docs.justificatifs,

    client: {
      prenom: d.client?.prenom || "",
      nom: d.client?.nom || "",
      email: d.client?.email || "",
      telephone: d.client?.telephone || "",
    },

    timeline: (d.timeline || []).map((t: any) => ({
      id: t.id,
      type: "status",
      title: t.titre,
      description: t.description || "",
      createdAt: t.date.toISOString(),
    })),
  };
}

export async function GET() {
  try {
    const demandes = await prisma.demande.findMany({
      include: {
        client: true,
        timeline: {
          orderBy: { date: "asc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(demandes.map((d: any) => formatDemande(d)));
  } catch (error) {
    console.error("Erreur GET demandes :", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = (body.clientEmail || body.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email client manquant" },
        { status: 400 }
      );
    }

    const accessCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    const client = await prisma.client.upsert({
      where: { email },
      update: {
        nom: body.nom || "",
        prenom: body.prenom || "",
        telephone: body.telephone || "",
      },
      create: {
        nom: body.nom || "",
        prenom: body.prenom || "",
        email,
        telephone: body.telephone || "",
        motDePasse: accessCode,
      },
    });

    const demande = await prisma.demande.create({
      data: {
        clientId: client.id,
        typePret: body.type || body.typePret || "Prêt Personnel",
        montant: Number(body.montant || 0),
        duree: Number(body.duree || 0),
        mensualite: Number(body.mensualite || 0),
        coutTotal: Number(body.coutTotal || 0),
        interets: Number(body.interets || 0),
        statut: "En cours",
        timeline: {
          create: {
            titre: "Demande créée",
            description:
              "Votre demande de financement a été enregistrée avec succès.",
          },
        },
      },
      include: {
        client: true,
        timeline: {
          orderBy: { date: "asc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      accessCode,
      demande: formatDemande(demande),
    });
  } catch (error) {
    console.error("Erreur POST demandes :", error);

    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
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
        { success: false, error: "ID manquant" },
        { status: 400 }
      );
    }

    const existing = await prisma.demande.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Demande introuvable" },
        { status: 404 }
      );
    }

    const demande = await prisma.demande.update({
      where: { id },
      data: {
        statut: statut || existing.statut,
        timeline: {
          create:
            timelineEvent || statut || commentaire
              ? {
                  titre:
                    timelineEvent?.title ||
                    (statut === "Accepté"
                      ? "Décision favorable"
                      : statut === "Refusé"
                      ? "Décision défavorable"
                      : commentaire
                      ? "Message conseiller"
                      : "Mise à jour du dossier"),
                  description:
                    timelineEvent?.description ||
                    commentaire ||
                    "Votre dossier a reçu une mise à jour.",
                }
              : undefined,
        },
      },
      include: {
        client: true,
        timeline: {
          orderBy: { date: "asc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      demande: formatDemande(demande, commentaire || ""),
    });
  } catch (error) {
    console.error("Erreur PATCH demandes :", error);

    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}