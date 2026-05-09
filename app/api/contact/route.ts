import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type ContactMessage = {
  id: string;
  createdAt: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  sujet?: string;
  message: string;
  statut: "Nouveau" | "Lu" | "Traité";
};

const filePath = path.join(process.cwd(), "data", "contacts.json");

async function readContacts(): Promise<ContactMessage[]> {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file);
  } catch {
    return [];
  }
}

async function saveContacts(contacts: ContactMessage[]) {
  await fs.writeFile(
    filePath,
    JSON.stringify(contacts, null, 2),
    "utf-8"
  );
}

// ===================== POST =====================
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.prenom ||
      !data.nom ||
      !data.email ||
      !data.telephone ||
      !data.message
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Champs obligatoires manquants",
        },
        { status: 400 }
      );
    }

    const contacts = await readContacts();

    const newMessage: ContactMessage = {
      id: `C-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      prenom: data.prenom.trim(),
      nom: data.nom.trim(),
      email: data.email.trim().toLowerCase(),
      telephone: data.telephone.trim(),
      sujet: data.sujet?.trim() || "",
      message: data.message.trim(),
      statut: "Nouveau",
    };

    contacts.unshift(newMessage);

    await saveContacts(contacts);

    console.log("📩 NOUVEAU MESSAGE CONTACT");
    console.log("=================================");
    console.log("ID           :", newMessage.id);
    console.log("Nom complet  :", newMessage.prenom, newMessage.nom);
    console.log("Téléphone    :", newMessage.telephone);
    console.log("Email        :", newMessage.email);
    console.log("Sujet        :", newMessage.sujet || "Non renseigné");
    console.log("Message      :", newMessage.message);
    console.log("=================================");

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
      contact: newMessage,
    });
  } catch (error) {
    console.error("Erreur API contact :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}

// ===================== GET =====================
export async function GET() {
  try {
    const contacts = await readContacts();

    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Erreur lecture contacts :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Impossible de récupérer les messages",
      },
      { status: 500 }
    );
  }
}

// ===================== PATCH =====================
export async function PATCH(request: Request) {
  try {
    const { id, statut } = await request.json();

    if (!id || !statut) {
      return NextResponse.json(
        {
          success: false,
          message: "ID ou statut manquant",
        },
        { status: 400 }
      );
    }

    const contacts = await readContacts();

    const updatedContacts = contacts.map((contact) =>
      contact.id === id
        ? {
            ...contact,
            statut,
          }
        : contact
    );

    await saveContacts(updatedContacts);

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour",
    });
  } catch (error) {
    console.error("Erreur PATCH contact :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}