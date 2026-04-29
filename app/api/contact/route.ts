import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("🚀 NOUVELLE DEMANDE REÇUE");
    console.log("=============================");
    console.log("Type de client :", data.typeClient);
    console.log("Nom complet   :", data.prenom, data.nom);
    console.log("Téléphone     :", data.telephone);
    console.log("Email         :", data.email);
    console.log("Montant       :", data.montantSouhaite, "€");
    console.log("Durée         :", data.duree, "mois");
    console.log("Mensualité    :", data.mensualite, "€");
    console.log("Message       :", data.message || "Aucun");
    console.log("=============================");

    // Pour le moment on affiche juste dans la console
    // Tu pourras plus tard ajouter l'envoi d'email ici

    return NextResponse.json({ 
      success: true, 
      message: "Demande reçue avec succès" 
    });

  } catch (error) {
    console.error("Erreur API :", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erreur interne du serveur" 
    }, { status: 500 });
  }
}