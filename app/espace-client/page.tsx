"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "../components/Header";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle,
  LogOut,
  FileText,
  Download,
  ShieldCheck,
  Clock,
  Wallet,
  Landmark,
  User,
  ArrowRight,
  CircleCheck,
  CircleDashed,
  CircleX,
  Headphones,
  Lock,
  CreditCard,
  Bell,
  X,
  Sparkles,
  CalendarClock,
  MessageSquare,
} from "lucide-react";

type Statut =
  | "En cours"
  | "Documents reçus"
  | "Vérification finale"
  | "Accepté"
  | "Fonds mis à disposition"
  | "Décaissement en préparation"
  | "Fonds transférés"
  | "Refusé";

type UploadedFile = {
  name: string;
  url: string;
  uploadedAt: string;
};

type TimelineEvent = {
  id: string;
  type: "created" | "status" | "document" | "comment" | "funding";
  title: string;
  description: string;
  createdAt: string;
};

type Demande = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  type: string;
  montant: number;
  duree?: number;
  mensualite?: number;
  statut: Statut;
  commentaire?: string;
  isIndependant?: boolean;
  contractToSign?: UploadedFile;
  signedContract?: UploadedFile;
  justificatifs: UploadedFile[];
  timeline?: TimelineEvent[];
  lastViewedAt?: string;
  client?: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    typeClient?: string;
  };
};

type ClientAccount = {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
};

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(null);

  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedDemandeId, setSelectedDemandeId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadTargetId, setUploadTargetId] = useState("");

  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const [newUpdateIds, setNewUpdateIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signedInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  const savedClient = sessionStorage.getItem("currentClient");

  if (!savedClient) return;

  const parsedClient = JSON.parse(savedClient);

  const lastActivity = sessionStorage.getItem("lastActivity");
  const now = Date.now();

  if (lastActivity && now - parseInt(lastActivity, 10) > 300000) {
    sessionStorage.removeItem("currentClient");
    sessionStorage.removeItem("lastActivity");
    return;
  }

  setCurrentClient(parsedClient);
  setIsLoggedIn(true);
  setEmail(parsedClient.email);
  sessionStorage.setItem("lastActivity", now.toString());
}, []);

  useEffect(() => {
    if (!isLoggedIn || !currentClient?.email) return;

    const loadDemandes = async () => {
      try {
        const res = await fetch("/api/demandes", {
          cache: "no-store",
        });

        const allDemandes = await res.json();

        const userDemandes = allDemandes.filter(
          (d: Demande) =>
            d.client?.email?.toLowerCase() ===
            currentClient.email.toLowerCase()
        );

        setDemandes((prev) => {
          if (prev.length > 0) {
            userDemandes.forEach((newDemande: Demande) => {
              const oldDemande = prev.find((p) => p.id === newDemande.id);

              if (!oldDemande) return;

              const markAsNew = () => {
                setHasNewUpdate(true);

                setNewUpdateIds((ids) =>
                  ids.includes(newDemande.id)
                    ? ids
                    : [newDemande.id, ...ids]
                );
              };

              if (oldDemande.statut !== newDemande.statut) {
                setNotifications((n) => [
                  `Votre dossier ${newDemande.id.slice(
                    0,
                    8
                  )} est maintenant : ${newDemande.statut}`,
                  ...n,
                ]);

                markAsNew();
              }

              if (
                oldDemande.commentaire !== newDemande.commentaire &&
                newDemande.commentaire
              ) {
                setNotifications((n) => [
                  "Nouveau commentaire conseiller sur votre dossier",
                  ...n,
                ]);

                markAsNew();
              }

              if (
                !oldDemande.contractToSign &&
                newDemande.contractToSign
              ) {
                setNotifications((n) => [
                  "Un contrat à signer est disponible",
                  ...n,
                ]);

                markAsNew();
              }

              if (!oldDemande.signedContract && newDemande.signedContract) {
                setNotifications((n) => [
                  "Contrat signé ajouté au dossier",
                  ...n,
                ]);

                markAsNew();
              }

              if (
                (newDemande.justificatifs?.length || 0) >
                (oldDemande.justificatifs?.length || 0)
              ) {
                setNotifications((n) => ["Nouveau document ajouté", ...n]);
                markAsNew();
              }
            });
          }

          return userDemandes;
        });

        if (userDemandes.length > 0 && !selectedDemandeId) {
          setSelectedDemandeId(userDemandes[0].id);
        }
      } catch (error) {
        console.error("Erreur chargement demandes :", error);
      }
    };

    loadDemandes();

    const interval = setInterval(loadDemandes, 3000);

    return () => clearInterval(interval);
  }, [isLoggedIn, currentClient, selectedDemandeId]);

  useEffect(() => {
    const updateActivity = () => {
      if (isLoggedIn) {
        sessionStorage.setItem("lastActivity", Date.now().toString());
      }
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const checkInactivity = () => {
      const lastActivity = sessionStorage.getItem("lastActivity");

      if (!lastActivity) return;

      const now = Date.now();
      const inactiveTime = now - parseInt(lastActivity, 10);

      if (inactiveTime > 300000) {
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const resetAccessCode = async () => {
  const emailToReset = resetEmail || email;

  if (!emailToReset.trim()) {
    alert("Veuillez entrer votre adresse email.");
    return;
  }

  setIsResetting(true);

  try {
    const res = await fetch("/api/client/reset-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailToReset.toLowerCase().trim(),
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      alert(result.error || "Impossible de générer un nouveau code.");
      return;
    }

    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    const updatedClients = clients.map((c: ClientAccount) =>
      c.email.toLowerCase() === emailToReset.toLowerCase()
        ? { ...c, password: result.accessCode }
        : c
    );

    localStorage.setItem("clients", JSON.stringify(updatedClients));

    alert(
      `Nouveau code d’accès généré.\n\nEmail : ${emailToReset}\nNouveau code : ${result.accessCode}\n\nConservez ce code pour vous connecter.`
    );

    setEmail(emailToReset.toLowerCase().trim());
    setPassword(result.accessCode);
    setShowReset(false);
  } catch (error) {
    console.error(error);
    alert("Erreur de connexion au serveur.");
  } finally {
    setIsResetting(false);
  }
};

 const login = async () => {

  if (!email.trim() || !password.trim()) {

    alert("Veuillez entrer votre email et votre code d’accès.");

    return;

  }

  try {

    const res = await fetch("/api/client/login", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        email: email.toLowerCase().trim(),

        password: password.trim(),

      }),

    });

    const result = await res.json();

    if (!res.ok || !result.success) {

      alert(result.error || "Email ou code d’accès incorrect");

      return;

    }

    const client = {

      email: result.client.email,

      password: password.trim(),

      nom: result.client.nom,

      prenom: result.client.prenom,

      telephone: result.client.telephone || "",

    };

    setCurrentClient(client);

    setIsLoggedIn(true);

    sessionStorage.setItem("currentClient", JSON.stringify(client));

    sessionStorage.setItem("lastActivity", Date.now().toString());

  } catch (error) {

    console.error(error);

    alert("Erreur de connexion au serveur.");

  }

};

  const logout = () => {
    sessionStorage.removeItem("currentClient");
    sessionStorage.removeItem("lastActivity");

    setIsLoggedIn(false);
    setCurrentClient(null);
    setEmail("");
    setPassword("");
    setDemandes([]);
    setNotifications([]);
    setHasNewUpdate(false);
    setNewUpdateIds([]);
  };



  const selectedDemande =
    demandes.find((d) => d.id === selectedDemandeId) || demandes[0];

  const totalMontant = demandes.reduce((sum, d) => sum + d.montant, 0);
  const enCours = demandes.filter((d) => d.statut === "En cours").length;
  const acceptes = demandes.filter((d) => d.statut === "Accepté").length;

  const getBadgeClass = (statut: Statut) => {
  switch (statut) {
    case "Accepté":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30";

    case "Refusé":
      return "bg-red-500/15 text-red-300 border border-red-400/30";

    case "Documents reçus":
      return "bg-blue-500/15 text-blue-300 border border-blue-400/30";

    case "Vérification finale":
      return "bg-violet-500/15 text-violet-300 border border-violet-400/30";

    case "Décaissement en préparation":
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30";

    case "Fonds mis à disposition":
      return "bg-indigo-500/15 text-indigo-300 border border-indigo-400/30";

    case "Fonds transférés":
      return "bg-green-500/20 text-green-300 border border-green-400/30";

    default:
      return "bg-amber-500/15 text-amber-300 border border-amber-400/30";
  }
};

const getStatusText = (statut: Statut) => {
  switch (statut) {
    case "Documents reçus":
      return "Documents reçus";

    case "Vérification finale":
      return "Vérification finale";

    case "Accepté":
      return "Dossier validé";

    case "Décaissement en préparation":
      return "Décaissement en préparation";

    case "Fonds mis à disposition":
      return "Fonds disponibles";

    case "Fonds transférés":
      return "Fonds transférés";

    case "Refusé":
      return "Dossier refusé";

    default:
      return "Analyse en cours";
  }
};

const getStatusIcon = (statut: Statut) => {
  switch (statut) {
    case "Accepté":
      return <CircleCheck className="w-5 h-5" />;

    case "Fonds transférés":
      return <Landmark className="w-5 h-5" />;

    case "Fonds mis à disposition":
    case "Décaissement en préparation":
      return <CreditCard className="w-5 h-5" />;

    case "Documents reçus":
    case "Vérification finale":
      return <FileText className="w-5 h-5" />;

    case "Refusé":
      return <CircleX className="w-5 h-5" />;

    default:
      return <CircleDashed className="w-5 h-5" />;
  }
};

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRequiredDocuments = (isIndependant?: boolean) => {
    if (isIndependant) {
      return {
        essentiels: [
          "Pièce d'identité",
          "Relevé d'identité bancaire (RIB / IBAN)",
          "Justificatif d’activité (registre, SIRET, ou équivalent)",
          "Relevés bancaires 3 mois",
        ],
        secondaires: [
          "Avis d'imposition",
          "Liasse fiscale",
          "Attestation URSSAF",
          "Justificatif domicile",
        ],
      };
    }

    return {
      essentiels: [
        "Pièce d'identité",
        "Relevé d'identité bancaire (RIB / IBAN)",
        "3 dernières fiches de paie ou avis de retraite",
        "Relevés bancaires 3 mois",
      ],
      secondaires: ["Avis d'imposition", "Justificatif domicile"],
    };
  };

  const hasEssentialDocs = (demande?: Demande) => {
    if (!demande?.justificatifs?.length) return false;

    const names = demande.justificatifs
      .map((file) => file.name.toLowerCase())
      .join(" ");

    const hasIdentity =
      names.includes("ident") ||
      names.includes("passport") ||
      names.includes("cni");

    const hasBank =
      names.includes("rib") ||
      names.includes("iban") ||
      names.includes("bank");

    const hasIncome =
      names.includes("paie") ||
      names.includes("salaire") ||
      names.includes("retraite") ||
      names.includes("bulletin") ||
      names.includes("revenu") ||
      names.includes("urssaf") ||
      names.includes("siret");

    const hasStatements = names.includes("relev") || names.includes("compte");

    return hasIdentity && hasBank && hasIncome && hasStatements;
  };

  const getMissingEssentialDocs = (demande?: Demande) => {
  if (!demande) return [];

  if (
    demande.statut === "Fonds mis à disposition" ||
    demande.statut === "Fonds transférés"
  ) {
    return [];
  }

  const missing: string[] = [];

  if (
    demande.statut === "Décaissement en préparation" &&
    !demande.signedContract
  ) {
    missing.push("Contrat signé");
  }

  const uploadedNames =
    demande.justificatifs?.map((file) => file.name.toLowerCase()) || [];

  const essentiels = getRequiredDocuments(demande.isIndependant).essentiels;

  const missingDocs = essentiels.filter((doc) => {
    const lowerDoc = doc.toLowerCase();

    if (lowerDoc.includes("pièce") || lowerDoc.includes("identité")) {
      return !uploadedNames.some(
        (name) =>
          name.includes("ident") ||
          name.includes("passport") ||
          name.includes("cni")
      );
    }

    if (lowerDoc.includes("rib") || lowerDoc.includes("iban")) {
      return !uploadedNames.some(
        (name) =>
          name.includes("rib") ||
          name.includes("iban") ||
          name.includes("bank")
      );
    }

    if (
      lowerDoc.includes("paie") ||
      lowerDoc.includes("retraite") ||
      lowerDoc.includes("revenu") ||
      lowerDoc.includes("urssaf")
    ) {
      return !uploadedNames.some(
        (name) =>
          name.includes("paie") ||
          name.includes("salaire") ||
          name.includes("retraite") ||
          name.includes("revenu") ||
          name.includes("urssaf")
      );
    }

    if (lowerDoc.includes("relevé")) {
      return !uploadedNames.some(
        (name) => name.includes("relev") || name.includes("compte")
      );
    }

    return true;
  });

  return [...missing, ...missingDocs];
};



  const getProgressPercent = (demande?: Demande) => {
  if (!demande) return 0;

  let progress = 10;

  switch (demande.statut) {
    case "En cours":
      progress = 15;
      break;

    case "Documents reçus":
      progress = 30;
      break;

    case "Vérification finale":
      progress = 50;
      break;

    case "Accepté":
      progress = 65;
      break;

    case "Décaissement en préparation":
      progress = 80;
      break;

    case "Fonds mis à disposition":
      progress = 95;
      break;

    case "Fonds transférés":
      progress = 100;
      break;

    case "Refusé":
      progress = 100;
      break;

    default:
      progress = 10;
  }

  if (demande.commentaire?.trim()) {
    progress += 3;
  }

  if (demande.contractToSign) {
    progress += 3;
  }

  if (demande.signedContract) {
    progress += 4;
  }

  if (demande.justificatifs?.length > 0) {
    progress += Math.min(demande.justificatifs.length * 2, 8);
  }

  return Math.min(progress, 100);
};

  const missingEssentialDocs = getMissingEssentialDocs(selectedDemande);
  const missingDocsCount = missingEssentialDocs.length;

  const requiredDocsCount = selectedDemande
    ? getRequiredDocuments(selectedDemande.isIndependant).essentiels.length
    : 0;

  const uploadedDocsCount = selectedDemande?.justificatifs?.length || 0;

  const isAdministrativelyComplete =
    selectedDemande?.statut === "Accepté" &&
    !!selectedDemande?.signedContract &&
    hasEssentialDocs(selectedDemande);

  const progressPercent = getProgressPercent(selectedDemande);

  const handleFileUpload = async (
    demandeId: string,
    type: "signed_contract" | "justificatifs",
    files: FileList
  ) => {
    if (!demandeId || files.length === 0) return;

    setUploading(true);

    try {
  const formData = new FormData();

  formData.append("demandeId", demandeId);
  formData.append("type", type);

  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    console.error("Erreur API upload :", result);

    alert(result.error || "Erreur lors de l’upload");
    return;
  }

  const refreshed = await fetch("/api/demandes", {
    cache: "no-store",
  });

  const allDemandes = await refreshed.json();

  const userDemandes = allDemandes.filter(
    (d: Demande) =>
      d.client?.email?.toLowerCase() === currentClient?.email.toLowerCase()
  );

  setDemandes(userDemandes);

  setNotifications((n) => [
    type === "signed_contract"
      ? "Contrat signé envoyé avec succès"
      : `${files.length} document(s) envoyé(s) avec succès`,
    ...n,
  ]);

  setHasNewUpdate(true);

  setNewUpdateIds((ids) =>
    ids.includes(demandeId) ? ids : [demandeId, ...ids]
  );
} catch (error) {
  console.error("Erreur upload client :", error);

  alert(
    error instanceof Error
      ? error.message
      : "Erreur de connexion pendant l’upload"
  );
} finally {
  setUploading(false);
  }
};

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (
    e: React.DragEvent,
    demandeId: string,
    type: "signed_contract" | "justificatifs"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(demandeId, type, e.dataTransfer.files);
    }
  };

  const downloadContract = (url?: string) => {
    if (!url) {
      alert("Aucun contrat disponible pour le moment.");
      return;
    }

    window.open(url, "_blank");
  };

    const buildTimeline = (demande?: Demande) => {
    if (!demande) return [];

    const getIcon = (type: TimelineEvent["type"]) => {
      if (type === "created") return CheckCircle;

      if (type === "status") {
        if (demande.statut === "Accepté") return CircleCheck;
        if (demande.statut === "Refusé") return CircleX;
        return Clock;
      }

      if (type === "document") return FileText;
      if (type === "comment") return MessageSquare;
      if (type === "funding") return Landmark;

      return Clock;
    };

    const getColor = (type: TimelineEvent["type"]) => {
      if (type === "created") return "emerald";

      if (type === "status") {
        if (demande.statut === "Accepté") return "emerald";
        if (demande.statut === "Refusé") return "red";
        return "amber";
      }

      if (type === "document") return "emerald";
      if (type === "comment") return "cyan";
      if (type === "funding") return "emerald";

      return "amber";
    };

    if (demande.timeline && demande.timeline.length > 0) {
      const apiEvents = [...demande.timeline]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        )
        .map((event) => ({
          title: event.title,
          desc: event.description,
          date: formatDateTime(event.createdAt),
          done: true,
          active: false,
          icon: getIcon(event.type),
          color: getColor(event.type),
        }));

      const extraEvents = [];

      if (demande.statut === "Accepté" && !demande.contractToSign) {
        extraEvents.push({
          title: "Contrat à signer",
          desc: "Votre contrat à signer n’est pas encore disponible.",
          date: "En attente",
          done: false,
          active: true,
          icon: FileText,
          color: "amber",
        });
      }

      if (demande.contractToSign) {
        extraEvents.push({
          title: "Contrat à signer disponible",
          desc: demande.contractToSign.name,
          date: formatDateTime(demande.contractToSign.uploadedAt),
          done: true,
          active: false,
          icon: FileText,
          color: "emerald",
        });
      }

      if (demande.statut === "Accepté" && !demande.signedContract) {
        extraEvents.push({
          title: "Signature du contrat",
          desc: "Contrat en attente de signature et de dépôt.",
          date: "En attente",
          done: false,
          active: true,
          icon: FileText,
          color: "amber",
        });
      }

      if (demande.signedContract) {
        extraEvents.push({
          title: "Contrat signé reçu",
          desc: demande.signedContract.name,
          date: formatDateTime(demande.signedContract.uploadedAt),
          done: true,
          active: false,
          icon: FileText,
          color: "emerald",
        });
      }

      if (demande.justificatifs?.length > 0) {
        demande.justificatifs.forEach((file, index) => {
          extraEvents.push({
            title: `Justificatif reçu ${index + 1}`,
            desc: file.name,
            date: formatDateTime(file.uploadedAt),
            done: true,
            active: false,
            icon: FileText,
            color: "emerald",
          });
        });
      } else if (demande.statut === "Accepté") {
        extraEvents.push({
          title: "Justificatifs",
          desc: "Aucun justificatif reçu pour le moment.",
          date: "En attente",
          done: false,
          active: true,
          icon: CalendarClock,
          color: "amber",
        });
      }

      return [...apiEvents, ...extraEvents];
    }

    const events = [
  {
    title: "Demande reçue",
    desc: "Votre demande de financement a été enregistrée avec succès.",
    date: formatDateTime(demande.createdAt),
    done: true,
    active: false,
    icon: CheckCircle,
    color: "emerald",
  },
  {
    title: "Analyse du dossier",
    desc:
      demande.statut === "En cours"
        ? "Votre dossier est en cours d’analyse par notre service."
        : "L’analyse préliminaire de votre dossier est terminée.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: demande.statut !== "En cours",
    active: demande.statut === "En cours",
    icon: Clock,
    color: "amber",
  },
];

if (demande.justificatifs?.length > 0 || demande.signedContract) {
  events.push({
    title: "Documents reçus",
    desc: "Vos documents ont été transmis et ajoutés à votre dossier.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: true,
    active: false,
    icon: FileText,
    color: "emerald",
  });
}

if (
  demande.statut === "Vérification finale" ||
  demande.statut === "Accepté" ||
  demande.statut === "Décaissement en préparation" ||
  demande.statut === "Fonds mis à disposition" ||
  demande.statut === "Fonds transférés"
) {
  events.push({
    title: "Vérification finale",
    desc: "Votre dossier est en phase de contrôle final avant validation définitive.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: demande.statut !== "Vérification finale",
    active: demande.statut === "Vérification finale",
    icon: ShieldCheck,
    color: demande.statut === "Vérification finale" ? "amber" : "emerald",
  });
}

if (
  demande.statut === "Accepté" ||
  demande.statut === "Décaissement en préparation" ||
  demande.statut === "Fonds mis à disposition" ||
  demande.statut === "Fonds transférés"
) {
  events.push({
    title: "Acceptation définitive",
    desc: "Votre dossier a été validé définitivement. Les modalités de mise à disposition sont en préparation.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: true,
    active: false,
    icon: CircleCheck,
    color: "emerald",
  });
}

if (
  demande.statut === "Décaissement en préparation" ||
  demande.statut === "Fonds mis à disposition" ||
  demande.statut === "Fonds transférés"
) {
  events.push({
    title: "Décaissement en préparation",
    desc: "La préparation administrative du décaissement est en cours.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done:
      demande.statut === "Fonds mis à disposition" ||
      demande.statut === "Fonds transférés",
    active: demande.statut === "Décaissement en préparation",
    icon: Landmark,
    color:
      demande.statut === "Décaissement en préparation" ? "amber" : "emerald",
  });
}

if (
  demande.statut === "Fonds mis à disposition" ||
  demande.statut === "Fonds transférés"
) {
  events.push({
    title: "Fonds mis à disposition",
    desc: "Le montant approuvé est disponible dans votre espace dossier sécurisé.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: demande.statut === "Fonds transférés",
    active: demande.statut === "Fonds mis à disposition",
    icon: CreditCard,
    color: demande.statut === "Fonds mis à disposition" ? "cyan" : "emerald",
  });
}

if (demande.statut === "Fonds transférés") {
  events.push({
    title: "Fonds transférés",
    desc: "Le transfert des fonds a été effectué selon les modalités prévues.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: true,
    active: false,
    icon: Landmark,
    color: "emerald",
  });
}

if (demande.commentaire) {
  events.push({
    title: "Message conseiller",
    desc: demande.commentaire,
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: true,
    active: false,
    icon: MessageSquare,
    color: "cyan",
  });
}

if (demande.statut === "Refusé") {
  events.push({
    title: "Décision défavorable",
    desc: "Votre demande n’a pas été retenue après analyse.",
    date: formatDateTime(demande.updatedAt || demande.createdAt),
    done: true,
    active: false,
    icon: CircleX,
    color: "red",
  });
}

if (demande.justificatifs?.length > 0) {
  demande.justificatifs.forEach((file, index) => {
    events.push({
      title: `Justificatif reçu ${index + 1}`,
      desc: file.name,
      date: formatDateTime(file.uploadedAt),
      done: true,
      active: false,
      icon: FileText,
      color: "emerald",
    });
  });
}

return events;
  };

  const timeline = buildTimeline(selectedDemande);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6 pt-24">
        <Header />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom,#1e293b,transparent_40%)]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-white/10 border-white/10 backdrop-blur-2xl shadow-2xl rounded-[2rem]">
            <CardHeader className="text-center p-10">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-emerald-300" />
              </div>

              <CardTitle className="text-3xl text-white">
                Espace Client
              </CardTitle>

              <p className="text-zinc-400 mt-3">
                Accédez à votre tableau de bord sécurisé
              </p>
            </CardHeader>

            <CardContent className="space-y-5 px-10 pb-10">
              <Input
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl"
              />

              <Input
                type="password"
                placeholder="Mot de passe / Code d’accès"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl"
              />

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowReset(!showReset);
                }}
                className="text-sm text-emerald-300 hover:text-emerald-200 text-left"
              >
                Code d’accès oublié ?
              </button>

              {showReset && (
                <div className="bg-black/20 border border-white/10 rounded-2xl p-4 space-y-3">
                  <p className="text-sm text-zinc-400">
                    Entrez votre email pour générer un nouveau code d’accès.
                  </p>

                  <Input
                    placeholder="Votre email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-12 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl"
                  />

                  <Button
                    onClick={resetAccessCode}
                    disabled={isResetting}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-2xl"
                  >
                    {isResetting ? "Génération..." : "Générer un nouveau code"}
                  </Button>
                </div>
              )}

              <Button
                onClick={login}
                className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
              >
                Se connecter
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-center text-zinc-500 pt-2">
                Connexion protégée — accès strictement personnel
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

    return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98122,transparent_35%),radial-gradient(circle_at_bottom_right,#2563eb22,transparent_40%)]" />

      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        {hasNewUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-2xl rounded-[2rem]">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-emerald-300" />
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-300">
                      Nouvelle activité détectée
                    </p>

                    <p className="text-sm text-zinc-300 mt-1">
                      {notifications[0] ||
                        "Votre dossier a reçu une mise à jour."}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setHasNewUpdate(false)}
                  className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
                >
                  Voir
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <Badge className="mb-5 bg-white/10 border border-white/10 text-zinc-300">
              Tableau de bord sécurisé
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Bonjour, {currentClient?.prenom}
            </h1>

            <p className="text-zinc-400 mt-4 text-lg">
              Suivez vos demandes, vos étapes de validation et vos documents.
            </p>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="border-white/15 bg-white/5 hover:bg-white/10 rounded-2xl h-12"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Déconnexion
          </Button>
        </div>

        {notifications.length > 0 && (
          <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-5 mb-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                  <p className="font-semibold">Centre de notifications</p>
                </div>

                <button
                  onClick={() => {
                    setNotifications([]);
                    setHasNewUpdate(false);
                    setNewUpdateIds([]);
                  }}
                  className="text-sm text-zinc-400 hover:text-white flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Effacer
                </button>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification, index) => (
                  <div
                    key={`${notification}-${index}`}
                    className="bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-zinc-300"
                  >
                    {notification}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <Card className="lg:col-span-7 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-zinc-300 mb-2">Montant total demandé</p>

                  <p className="text-5xl md:text-7xl font-bold tracking-tight">
                    {totalMontant.toLocaleString("fr-FR")} €
                  </p>

                  <p className="text-zinc-400 mt-4">
                    {demandes.length} dossier(s) enregistré(s)
                  </p>
                </div>

                <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Landmark className="w-8 h-8 text-emerald-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">En cours</p>
                  <p className="text-3xl font-bold mt-2">{enCours}</p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">Acceptées</p>
                  <p className="text-3xl font-bold mt-2 text-emerald-300">
                    {acceptes}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5 col-span-2 md:col-span-1">
                  <p className="text-zinc-400 text-sm">Sécurité</p>
                  <p className="text-lg font-semibold mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    Vérifié
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Headphones className="w-6 h-6 text-emerald-300" />
                Conseiller dédié
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <User className="w-7 h-7 text-emerald-300" />
                </div>

                <div>
                  <p className="font-semibold">Service Client Essor Crédit</p>
                  <p className="text-sm text-zinc-400">
                    Assistance dossier & suivi
                  </p>
                </div>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-3xl p-5 text-sm text-zinc-300">
                Votre dossier est traité de manière sécurisée. Les informations
                visibles ici sont synchronisées automatiquement avec votre espace
                de suivi.
              </div>
            </CardContent>
          </Card>
        </div>

        {demandes.length === 0 ? (
          <Card className="bg-white/10 border-white/10 rounded-[2rem]">
            <CardContent className="p-12 text-center">
              <Wallet className="w-14 h-14 mx-auto text-zinc-500 mb-5" />
              <p className="text-2xl font-semibold">Aucune demande trouvée</p>
              <p className="text-zinc-400 mt-2">
                Vos demandes apparaîtront ici après validation du formulaire.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Mes dossiers</h2>

              {demandes.map((d) => (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setSelectedDemandeId(d.id);

                    setNewUpdateIds((ids) =>
                      ids.filter((id) => id !== d.id)
                    );

                    if (newUpdateIds.length <= 1) {
                      setHasNewUpdate(false);
                    }
                  }}
                  className={`w-full text-left rounded-[1.75rem] p-5 border transition-all ${
                    selectedDemande?.id === d.id
                      ? "bg-white/15 border-emerald-400/40"
                      : "bg-white/7 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-mono text-xs text-zinc-500">
                        {d.id}
                      </p>
                      <p className="text-lg font-semibold mt-1">{d.type}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getBadgeClass(d.statut)}>
                        {d.statut}
                      </Badge>

                      {newUpdateIds.includes(d.id) && (
                        <span className="text-[11px] bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-3xl font-bold mt-5">
                    {d.montant.toLocaleString("fr-FR")} €
                  </p>

                  <p className="text-sm text-zinc-400 mt-2">
                    Demandé le {formatDate(d.createdAt)}
                  </p>
                </motion.button>
              ))}
            </div>

            {selectedDemande && (
              <div className="lg:col-span-8 space-y-6">
                <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                  <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={getBadgeClass(selectedDemande.statut)}>
                            <span className="flex items-center gap-2">
                              {getStatusIcon(selectedDemande.statut)}
                              {getStatusText(selectedDemande.statut)}
                            </span>
                          </Badge>

                          <span className="text-zinc-500 font-mono text-sm">
                            {selectedDemande.id}
                          </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold">
                          {selectedDemande.montant.toLocaleString("fr-FR")} €
                        </h2>

                        <p className="text-zinc-400 mt-3">
                          {selectedDemande.type} — créé le{" "}
                          {formatDate(selectedDemande.createdAt)}
                        </p>
                        {(selectedDemande.statut === "Fonds mis à disposition" ||
  selectedDemande.statut === "Fonds transférés") && (
  <div className="mt-6 bg-indigo-500/10 border border-indigo-400/30 rounded-3xl p-5">
    <p className="text-sm text-indigo-300 font-medium">
      {selectedDemande.statut === "Fonds transférés"
        ? "Montant transféré selon les modalités prévues"
        : "Montant disponible dans votre espace sécurisé"}
    </p>

    <p className="text-4xl font-bold text-white mt-2">
      {selectedDemande.montant.toLocaleString("fr-FR")} €
    </p>

    <p className="text-sm text-zinc-400 mt-3">
      {selectedDemande.statut === "Fonds transférés"
        ? "Le transfert a été effectué avec succès."
        : "Les modalités de décaissement sont en cours de préparation."}
    </p>
  </div>
)}

                        <div className="mt-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-zinc-400">
                              Progression du dossier
                            </span>

                            <span className="font-semibold text-emerald-300">
                              {progressPercent}%
                            </span>
                          </div>

                          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-full rounded-full ${
                                selectedDemande.statut === "Refusé"
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <div className="bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm">
                            <span className="text-zinc-400">
                              Documents restants :
                            </span>{" "}
                            <span className="font-semibold text-white">
                              {missingDocsCount}
                            </span>
                          </div>

                          <div className="bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm">
                            <span className="text-zinc-400">
                              Justificatifs reçus :
                            </span>{" "}
                            <span className="font-semibold text-emerald-300">
                              {uploadedDocsCount}/{requiredDocsCount}
                            </span>
                          </div>

                          {isAdministrativelyComplete && (
                            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl px-4 py-3 text-sm font-semibold text-emerald-300">
                              ✓ Dossier administrativement complet
                            </div>
                          )}
                        </div>

                        {missingEssentialDocs.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {missingEssentialDocs.map((doc, index) => (
                              <div
                                key={index}
                                className="text-xs text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2"
                              >
                                Document manquant : {doc}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                        <CreditCard className="w-10 h-10 text-emerald-300" />
                      </div>
                    </div>

                    {selectedDemande.commentaire && (
                      <div className="mt-8 bg-black/20 border border-white/10 rounded-3xl p-5">
                        <p className="text-sm text-zinc-500 mb-2">
                          Message du service
                        </p>
                        <p className="text-zinc-200">
                          {selectedDemande.commentaire}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-black/20 rounded-3xl p-5 border border-white/10">
                        <p className="text-zinc-500 text-sm">Durée</p>
                        <p className="text-2xl font-semibold mt-2">
                          {selectedDemande.duree || "—"} mois
                        </p>
                      </div>

                      <div className="bg-black/20 rounded-3xl p-5 border border-white/10">
                        <p className="text-zinc-500 text-sm">Mensualité</p>
                        <p className="text-2xl font-semibold mt-2">
                          {selectedDemande.mensualite
                            ? `${selectedDemande.mensualite.toLocaleString(
                                "fr-FR"
                              )} €`
                            : "—"}
                        </p>
                      </div>

                      <div className="bg-black/20 rounded-3xl p-5 border border-white/10">
                        <p className="text-zinc-500 text-sm">Profil</p>
                        <p className="text-2xl font-semibold mt-2">
                          {selectedDemande.isIndependant
                            ? "Indépendant"
                            : "Particulier"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Progression du dossier
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {timeline.map((step, index) => {
                      const Icon = step.icon;

                      const colorClass =
                        step.color === "emerald"
                          ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                          : step.color === "red"
                          ? "bg-red-500/20 border-red-400/30 text-red-300"
                          : step.color === "cyan"
                          ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"
                          : "bg-amber-500/20 border-amber-400/30 text-amber-300";

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative flex gap-4"
                        >
                          {index !== timeline.length - 1 && (
                            <div className="absolute left-5 top-11 bottom-[-22px] w-px bg-white/10" />
                          )}

                          <div
                            className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border ${colorClass}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <p className="font-semibold">{step.title}</p>

                              <span className="text-xs text-zinc-500">
                                {step.date}
                              </span>
                            </div>

                            <p className="text-sm text-zinc-400 mt-2">
                              {step.desc}
                            </p>

                            {step.active && (
                              <div className="mt-3 inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-full px-3 py-1">
                                <Clock className="w-3 h-3" />
                                En cours
                              </div>
                            )}

                            {step.done && (
                              <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1">
                                <CheckCircle className="w-3 h-3" />
                                Validé
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                {selectedDemande.statut !== "Refusé" &&
                 selectedDemande.statut !== "Fonds transférés" && (
                  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Signature & documents
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                          <FileText className="w-8 h-8 text-emerald-300 mb-4" />

                          <p className="font-semibold">Contrat de prêt</p>

                          <p className="text-sm text-zinc-400 mt-2">
                            Téléchargez le contrat à signer, signez-le puis déposez-le.
                          </p>

                          <Button
                            onClick={() =>
                              downloadContract(selectedDemande.contractToSign?.url)
                            }
                            className="mt-5 w-full bg-white text-black hover:bg-zinc-200 rounded-2xl"
                          >
                            <Download className="mr-2 w-4 h-4" />
                            Télécharger
                          </Button>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                          <ShieldCheck className="w-8 h-8 text-emerald-300 mb-4" />

                          <p className="font-semibold">Dépôt sécurisé</p>

                          <p className="text-sm text-zinc-400 mt-2">
                            Déposez ici votre contrat signé et vos documents justificatifs.
                          </p>

                          <Button
                            onClick={() => {
                              setUploadTargetId(selectedDemande.id);
                              signedInputRef.current?.click();
                            }}
                            disabled={uploading}
                            className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
                          >
                            <Upload className="mr-2 w-4 h-4" />
                            {uploading ? "Envoi..." : "Déposer le contrat signé"}
                          </Button>
                        </div>
                      </div>

                      {selectedDemande.contractToSign && (
                        <div className="text-emerald-300 text-sm flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4">
                          <CheckCircle className="w-4 h-4" />
                          Contrat à signer disponible :{" "}
                          {selectedDemande.contractToSign.name}
                        </div>
                      )}

                      {selectedDemande.signedContract && (
                        <div className="text-emerald-300 text-sm flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4">
                          <CheckCircle className="w-4 h-4" />
                          Contrat signé reçu : {selectedDemande.signedContract.name}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold mb-4">
                          Justificatifs attendus
                        </p>

                        <div className="grid md:grid-cols-2 gap-3 mb-6">
                          {getRequiredDocuments(
                            selectedDemande.isIndependant
                          ).essentiels.map((doc, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-zinc-300"
                            >
                              <FileText className="w-4 h-4 text-zinc-500" />
                              {doc}
                            </div>
                          ))}
                        </div>

                        <p className="font-semibold mt-8 mb-4">
                          Documents complémentaires si disponibles
                        </p>

                        <div className="grid md:grid-cols-2 gap-3 mb-6">
                          {getRequiredDocuments(
                            selectedDemande.isIndependant
                          ).secondaires.map((doc, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-zinc-400"
                            >
                              <FileText className="w-4 h-4 text-zinc-500" />
                              {doc}
                            </div>
                          ))}
                        </div>

                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={(e) =>
                            handleDrop(e, selectedDemande.id, "justificatifs")
                          }
                          onClick={() => {
                            setUploadTargetId(selectedDemande.id);
                            fileInputRef.current?.click();
                          }}
                          className={`border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition ${
                            dragActive
                              ? "border-emerald-400 bg-emerald-500/10"
                              : "border-white/15 hover:border-emerald-400/40 bg-black/20"
                          }`}
                        >
                          <Upload className="mx-auto w-12 h-12 text-zinc-500 mb-4" />

                          <p className="font-semibold text-lg">
                            Déposer vos documents
                          </p>

                          <p className="text-zinc-500 mt-1">
                            Glissez-déposez vos fichiers ou cliquez ici
                          </p>
                        </div>

                        {selectedDemande.justificatifs?.length > 0 && (
                          <div className="mt-5 space-y-2">
                            {selectedDemande.justificatifs.map((file, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-2xl p-4 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-300" />

                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-emerald-300"
                                >
                                  {file.name}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={(e) =>
          e.target.files &&
          handleFileUpload(
            uploadTargetId || selectedDemande?.id || "",
            "justificatifs",
            e.target.files
          )
        }
      />

      <input
        type="file"
        ref={signedInputRef}
        className="hidden"
        onChange={(e) =>
          e.target.files &&
          handleFileUpload(
            uploadTargetId || selectedDemande?.id || "",
            "signed_contract",
            e.target.files
          )
        }
      />
    </main>
  );
}