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
    sexe?: string;
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
  sexe?: string;
};

export default function EspaceClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [currentClient, setCurrentClient] = useState<ClientAccount | null>(
    null
  );

  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedDemandeId, setSelectedDemandeId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadTargetId, setUploadTargetId] = useState("");

  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const [newUpdateIds, setNewUpdateIds] = useState<string[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

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

              if (!oldDemande.contractToSign && newDemande.contractToSign) {
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
        sexe: result.client.sexe || "",
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
    setShowNotificationPanel(false);
  };

  const selectedDemande =
  demandes.find((d) => d.id === selectedDemandeId) || demandes[0];

  const isFundingPreparation =
    selectedDemande?.statut === "Décaissement en préparation";

  const isFundsAvailable =
    selectedDemande?.statut === "Fonds mis à disposition";

  const shouldShowDocumentsCard =
    selectedDemande?.statut !== "Refusé" &&
    selectedDemande?.statut !== "Fonds transférés" &&
    selectedDemande?.statut !== "Décaissement en préparation" &&
    selectedDemande?.statut !== "Fonds mis à disposition";

  const totalMontant = demandes.reduce((sum, d) => sum + d.montant, 0);

  const enCours = demandes.filter((d) =>
    [
      "En cours",
      "Documents reçus",
      "Vérification finale",
      "Décaissement en préparation",
    ].includes(d.statut)
  ).length;

  const acceptes = demandes.filter((d) =>
    ["Accepté", "Fonds mis à disposition", "Fonds transférés"].includes(
      d.statut
    )
  ).length;

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

  const formatSecureReference = (id?: string) => {
    if (!id) return "—";

    const cleanId = id.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const middlePart = cleanId.slice(3, 6) || "000";
    const lastPart = cleanId.slice(-5) || "DOSSIER";

    return `CMP-${middlePart}-${lastPart}`;
  };

  const getTransferDate = (demande?: Demande, fallback?: string) => {
    if (!demande) return "—";
    return formatDateTime(demande.updatedAt || fallback || demande.createdAt);
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
      names.includes("rib") || names.includes("iban") || names.includes("bank");

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
      demande.statut === "Décaissement en préparation" ||
      demande.statut === "Fonds mis à disposition" ||
      demande.statut === "Fonds transférés"
    ) {
      return [];
    }

    const uploadedNames =
      demande.justificatifs?.map((file) => file.name.toLowerCase()) || [];

    const essentiels = getRequiredDocuments(demande.isIndependant).essentiels;

    return essentiels.filter((doc) => {
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
  };

  const getProgressPercent = (demande?: Demande) => {
    if (!demande) return 0;

    switch (demande.statut) {
      case "En cours":
        return 15;

      case "Documents reçus":
        return 30;

      case "Vérification finale":
        return 50;

      case "Accepté":
        return 65;

      case "Décaissement en préparation":
        return 80;

      case "Fonds mis à disposition":
        return 95;

      case "Fonds transférés":
        return 100;

      case "Refusé":
        return 100;

      default:
        return 10;
    }
  };

  const missingEssentialDocs = getMissingEssentialDocs(selectedDemande);
  const missingDocsCount = missingEssentialDocs.length;

  const requiredDocsCount = selectedDemande
    ? getRequiredDocuments(selectedDemande.isIndependant).essentiels.length
    : 0;

  const uploadedDocsCount = selectedDemande?.justificatifs?.length || 0;

  const isAdministrativelyComplete =
    !!selectedDemande?.signedContract &&
    hasEssentialDocs(selectedDemande) &&
    selectedDemande?.statut !== "Refusé";


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

  const getCivilite = (sexe?: string) => {
    const normalizedSexe = sexe?.toLowerCase().trim();

    if (!normalizedSexe) return "";

    if (
      [
        "homme",
        "h",
        "masculin",
        "male",
        "m",
        "monsieur",
        "mr",
        "m.",
      ].includes(normalizedSexe)
    ) {
      return "Monsieur";
    }

    if (
      [
        "femme",
        "f",
        "féminin",
        "feminin",
        "female",
        "madame",
        "mme",
        "mrs",
        "ms",
      ].includes(normalizedSexe)
    ) {
      return "Madame";
    }

    return sexe || "";
  };

 const buildTimeline = (demande?: Demande) => {
  if (!demande) return [];

  const successfulStatus: Statut[] = [
    "Accepté",
    "Décaissement en préparation",
    "Fonds mis à disposition",
    "Fonds transférés",
  ];

  const getIcon = (event: TimelineEvent) => {
  const lowerTitle = event.title.toLowerCase();

  if (event.type === "created") return CheckCircle;

  if (
    lowerTitle.includes("contrat") ||
    lowerTitle.includes("justificatif")
  ) {
    return CheckCircle;
  }

  if (event.type === "status") {
    if (lowerTitle.includes("refusé")) return CircleX;

    if (
      successfulStatus.some((status) =>
        lowerTitle.includes(status.toLowerCase())
      )
    ) {
      return CircleCheck;
    }

    return Clock;
  }

  if (event.type === "document") return CheckCircle;
  if (event.type === "comment") return MessageSquare;
  if (event.type === "funding") return Landmark;

  return Clock;
};

  const getColor = (event: TimelineEvent) => {
  if (event.type === "created") return "emerald";

  if (
    event.title.toLowerCase().includes("contrat") ||
    event.title.toLowerCase().includes("justificatif")
  ) {
    return "emerald";
  }

  if (event.type === "status") {
    if (event.title.toLowerCase().includes("refusé")) return "red";

    if (
      successfulStatus.some((status) =>
        event.title.toLowerCase().includes(status.toLowerCase())
      )
    ) {
      return "emerald";
    }

    return "amber";
  }

  if (event.type === "document") return "emerald";
  if (event.type === "comment") return "cyan";
  if (event.type === "funding") return "emerald";

  return "amber";
};

  if (demande.timeline && demande.timeline.length > 0) {
    return [...demande.timeline]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
      .map((event) => ({
        title:
          event.title.includes("Accepté") &&
          demande.justificatifs?.length > 0
            ? "Justificatifs acceptés"
            : event.title,

        desc:
          event.title.includes("Accepté") &&
          demande.justificatifs?.length > 0
            ? "Vos justificatifs ont été vérifiés et acceptés. Votre dossier passe à l’étape de mise à disposition des fonds."
            : event.description,

        date: formatDateTime(event.createdAt),
        done: true,
        active: false,
        icon: getIcon(event),
        color: getColor(event),
      }));
  }

  return [
    {
      title: "Demande reçue",
      desc: "Votre demande de financement a été enregistrée avec succès.",
      date: formatDateTime(demande.createdAt),
      done: true,
      active: false,
      icon: CheckCircle,
      color: "emerald",
    },
  ];
};

  const timeline = buildTimeline(selectedDemande);

  const notificationEvents = timeline
    .filter((step) => {
      const lowerTitle = step.title.toLowerCase();

      if (selectedDemande?.statut === "Fonds transférés") {
        return !lowerTitle.includes("fonds mis à disposition");
      }

      return true;
    })
    .map((step) => ({
      title: step.title,
      desc: step.desc,
      date: step.date,
      icon: step.icon,
      color: step.color,
      source: "timeline" as const,
    }))
    .reverse();

  const liveNotificationEvents = notifications.map((notification, index) => ({
    title: notification,
    desc: "Notification automatique liée à votre dossier.",
    date: index === 0 ? "Maintenant" : "Récent",
    icon: Bell,
    color: "emerald",
    source: "notification" as const,
  }));

  const allNotificationEvents = [
    ...liveNotificationEvents,
    ...notificationEvents,
  ].slice(0, 12);

  const unreadCount = newUpdateIds.length + notifications.length;
  const secureReference = formatSecureReference(selectedDemande?.id);
  const secureSyncDate = formatDateTime(
    selectedDemande?.updatedAt || selectedDemande?.createdAt
  );

  const isFundsTransferred = selectedDemande?.statut === "Fonds transférés";
  const shouldShowFundingArea = isFundsAvailable || isFundsTransferred;

  const transferSteps = [
  {
    title: "IBAN bénéficiaire vérifié",
    desc: "Les coordonnées bancaires du bénéficiaire ont été vérifiées et sécurisées.",
    done: shouldShowFundingArea,
    date: shouldShowFundingArea ? formatDateTime(selectedDemande?.createdAt) : "",
  },
  {
    title: "Préparation du virement",
    desc: "Le service financier prépare l’ordre de transfert bancaire sécurisé.",
    done: shouldShowFundingArea,
    date: shouldShowFundingArea ? getTransferDate(selectedDemande) : "",
  },
  {
    title: "Validation finale",
    desc: isFundsTransferred
      ? "La validation finale du dossier a été confirmée avant émission du transfert."
      : "Contrôle réglementaire final avant émission du transfert bancaire.",
    done: isFundsTransferred,
    date: isFundsTransferred ? getTransferDate(selectedDemande) : "",
  },
  {
    title: isFundsTransferred
      ? "Transfert bancaire exécuté"
      : "Transfert bancaire en attente",
    desc: isFundsTransferred
      ? "Le montant a été transmis avec succès vers le compte bénéficiaire selon les modalités validées."
      : "Le transfert sera visible dès la validation complète par le service financier.",
    done: isFundsTransferred,
    date: isFundsTransferred ? getTransferDate(selectedDemande) : "",
  },
];

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
        <div className="relative flex justify-end mb-8">
          <button
            type="button"
            onClick={() => {
              setShowNotificationPanel(!showNotificationPanel);
              setHasNewUpdate(false);
            }}
            className="relative h-12 px-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition flex items-center gap-3 text-sm text-zinc-200"
          >
            <Bell className="w-5 h-5 text-emerald-300" />
            Notifications

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-6 h-6 px-2 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotificationPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-16 z-50 w-full max-w-md"
            >
              <Card className="bg-[#101421]/95 border-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-white flex items-center gap-3">
                      <Bell className="w-5 h-5 text-emerald-300" />
                      Centre de notifications
                    </CardTitle>

                    <button
                      type="button"
                      onClick={() => setShowNotificationPanel(false)}
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-zinc-400 mt-2">
                    Tous les événements du dossier sont regroupés ici.
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 max-h-[420px] overflow-y-auto pr-4">
                  {allNotificationEvents.length === 0 ? (
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-5 text-sm text-zinc-400 text-center">
                      Aucune notification pour le moment.
                    </div>
                  ) : (
                    allNotificationEvents.map((event, index) => {
                      const Icon = event.icon;

                      const colorClass =
                        event.color === "emerald"
                          ? "bg-emerald-500/15 border-emerald-400/25 text-emerald-300"
                          : event.color === "red"
                          ? "bg-red-500/15 border-red-400/25 text-red-300"
                          : event.color === "cyan"
                          ? "bg-cyan-500/15 border-cyan-400/25 text-cyan-300"
                          : "bg-amber-500/15 border-amber-400/25 text-amber-300";

                      return (
                        <div
                          key={`${event.title}-${event.date}-${index}`}
                          className="bg-black/20 border border-white/10 rounded-2xl p-4 flex gap-3"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colorClass}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-semibold text-sm text-white">
                                {event.title}
                              </p>

                              <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                                {event.date}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                              {event.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {allNotificationEvents.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications([]);
                        setHasNewUpdate(false);
                        setNewUpdateIds([]);
                      }}
                      className="w-full mt-2 text-sm text-zinc-400 hover:text-white bg-white/5 border border-white/10 rounded-2xl py-3"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <Badge className="mb-5 bg-white/10 border border-white/10 text-zinc-300">
              Tableau de bord sécurisé
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Bonjour, {[getCivilite(currentClient?.sexe), currentClient?.nom]
                .filter(Boolean)
                .join(" ")}
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
                          <Badge
                            className={getBadgeClass(selectedDemande.statut)}
                          >
                            <span className="flex items-center gap-2">
                              {getStatusIcon(selectedDemande.statut)}
                              {getStatusText(selectedDemande.statut)}
                            </span>
                          </Badge>

                          <span className="text-zinc-500 font-mono text-sm">
                            {secureReference}
                          </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold">
                          {selectedDemande.montant.toLocaleString("fr-FR")} €
                        </h2>

                        <p className="text-zinc-400 mt-3">
                          {selectedDemande.type} — créé le{" "}
                          {formatDate(selectedDemande.createdAt)}
                        </p>

                        {(selectedDemande.statut ===
                          "Fonds mis à disposition" ||
                          selectedDemande.statut === "Fonds transférés") && (
                          <div className="mt-6 bg-indigo-500/10 border border-indigo-400/30 rounded-3xl p-5">
                            <p className="text-sm text-indigo-300 font-medium">
                              {selectedDemande.statut === "Fonds transférés"
                                ? "Montant transféré selon les modalités prévues"
                                : "Montant disponible dans votre espace sécurisé"}
                            </p>

                            <p className="text-4xl font-bold text-white mt-2">
                              {selectedDemande.montant.toLocaleString("fr-FR")}{" "}
                              €
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

                                {shouldShowFundingArea && (
                  <Card className="bg-indigo-500/10 border border-indigo-400/30 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Landmark className="w-6 h-6 text-indigo-300" />
                        Espace sécurisé des fonds
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-8 pt-0">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 bg-black/20 border border-white/10 rounded-3xl p-6">
                          <p className="text-sm text-indigo-300 font-medium">
                            Montant réservé et disponible
                          </p>

                          <p className="text-5xl font-bold text-white mt-3">
                            {selectedDemande.montant.toLocaleString("fr-FR")} €
                          </p>

                          <p className="text-zinc-300 mt-4">
                            Les fonds sont affichés dans votre espace client sécurisé. La
                            préparation du transfert bancaire peut maintenant se poursuivre
                            selon les modalités prévues.
                          </p>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
                          <p className="text-sm text-zinc-400">Statut</p>

                          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 rounded-full px-4 py-2 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                             {isFundsTransferred ? "Fonds transférés" : "Fonds disponibles"}
                          </div>

                          <p className="text-sm text-zinc-400 mt-5">
                            Référence dossier
                          </p>

                          <p className="text-sm font-mono text-zinc-300 mt-2 break-all">
                            {secureReference}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-5">
                        <p className="text-indigo-300 font-semibold">
                         {isFundsTransferred
                          ? "Transfert bancaire finalisé"
                          : "Prochaine étape : préparation du transfert"}
                       </p>

                         <p className="text-sm text-zinc-300 mt-2">
                            {isFundsTransferred
                             ? "Le transfert bancaire a été exécuté selon les modalités validées. Le dossier est désormais finalisé."
                              : "Le service financier prépare les modalités de décaissement. Vous serez informé dès que le transfert passera à l’étape suivante."}
                        </p>
                      </div>

                      <div className="mt-5 grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                          <p className="text-sm text-zinc-400">Canal de transfert</p>
                          <p className="text-lg font-semibold text-white mt-2">
                            Virement bancaire sécurisé
                          </p>
                          <p className="text-xs text-zinc-500 mt-2">
                            Traitement selon les coordonnées bancaires validées.
                          </p>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
                          <p className="text-sm text-zinc-400">Synchronisation</p>
                          <p className="text-lg font-semibold text-emerald-300 mt-2">
                            Données à jour
                          </p>
                          <p className="text-xs text-zinc-500 mt-2">
                            Dernière synchronisation : {secureSyncDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(isFundsAvailable ||
                  selectedDemande?.statut === "Fonds transférés") && (
                  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Landmark className="w-6 h-6 text-emerald-300" />
                        Étape de transfert bancaire
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      
                        {transferSteps.map((step, index) => (
                        <div key={index} className="relative flex gap-4">
                        {index !== transferSteps.length - 1 && (
                        <div className="absolute left-5 top-11 bottom-[-22px] w-px bg-white/10" />
                       )}

                          <div
                            className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                              step.done
                                ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                                : "bg-amber-500/10 border-amber-400/20 text-amber-300"
                            }`}
                          >
                            {step.done ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>

                          <div className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <p className="font-semibold">{step.title}</p>

                              <span className="text-xs text-zinc-500">
                                {step.done ? "Validé" : "En attente"}
                              </span>
                            </div>

                            <p className="text-sm text-zinc-400 mt-2">
                              {step.desc}
                            </p>
                            {step.done && step.date && (
                              <p className="text-xs text-zinc-500 mt-2">
                                {step.date}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Centre de décaissement */}
{shouldShowFundingArea && (
  <Card className="bg-emerald-500/10 border border-emerald-400/25 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-300" />
        Centre de décaissement
      </CardTitle>
    </CardHeader>

    <CardContent className="grid md:grid-cols-2 gap-4">
      <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
        <p className="text-sm text-zinc-400">Référence opération</p>
        <p className="font-mono text-lg text-white mt-2">{secureReference}</p>
      </div>

      <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
        <p className="text-sm text-zinc-400">Niveau de sécurité</p>
        <p className="text-lg font-semibold text-emerald-300 mt-2">
          Contrôle renforcé
        </p>
      </div>

      <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
        <p className="text-sm text-zinc-400">Canal bancaire</p>
        <p className="text-lg font-semibold text-white mt-2">
          Virement sécurisé
        </p>
      </div>

      <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
        <p className="text-sm text-zinc-400">État actuel</p>
        <p className="text-lg font-semibold text-white mt-2">
          {isFundsTransferred ? "Transfert exécuté" : "Validation en cours"}
        </p>
      </div>
    </CardContent>
  </Card>
)}

{isFundsTransferred && (
  <Card className="bg-green-500/10 border border-green-400/30 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-300" />
        Confirmation finale
      </CardTitle>
    </CardHeader>

    {isFundsTransferred && (
  <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-3">
        <FileText className="w-6 h-6 text-emerald-300" />
        Justificatif de transfert
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-5">
      <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
        <p className="text-sm text-zinc-400">Statut du justificatif</p>

        <p className="text-xl font-semibold text-emerald-300 mt-2">
          Disponible dans l’espace sécurisé
        </p>

        <p className="text-sm text-zinc-300 mt-3">
          Le justificatif lié à l’opération de transfert est rattaché à la
          référence sécurisée du dossier.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
          <p className="text-sm text-zinc-400">Référence dossier</p>
          <p className="font-mono text-white mt-2">{secureReference}</p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
          <p className="text-sm text-zinc-400">Date d’émission</p>
          <p className="text-white mt-2">{getTransferDate(selectedDemande)}</p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-3xl p-5">
          <p className="text-sm text-zinc-400">Type</p>
          <p className="text-white font-semibold mt-2">Reçu de transfert</p>
        </div>
      </div>

      <Button
        disabled
        className="w-full h-12 rounded-2xl bg-white/10 text-zinc-400 cursor-not-allowed"
      >
        <Download className="mr-2 w-4 h-4" />
        Téléchargement bientôt disponible
      </Button>
    </CardContent>
  </Card>
)}

    <CardContent className="space-y-5">
      <div className="bg-black/20 border border-white/10 rounded-3xl p-6">
        <p className="text-sm text-green-300 font-semibold">
          Transfert bancaire confirmé
        </p>

        <p className="text-4xl font-bold text-white mt-3">
          {selectedDemande.montant.toLocaleString("fr-FR")} €
        </p>

        <p className="text-sm text-zinc-300 mt-3">
          Le montant a été transféré selon les modalités validées. La référence
          de confirmation est associée à votre dossier sécurisé.
        </p>
      </div>
    </CardContent>
  </Card>
)}

                   

                {isFundingPreparation ? (
                  <Card className="bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-2xl rounded-[2rem]">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-cyan-300" />
                        </div>

                        <div>
                          <p className="text-cyan-300 font-semibold text-lg">
                            Mise à disposition des fonds en préparation
                          </p>

                          <p className="text-zinc-300 mt-2">
                            Votre dossier est administrativement complet. Les
                            modalités de décaissement sont en cours de
                            préparation par le service financier.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                ) : shouldShowDocumentsCard ? (
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
                            Téléchargez le contrat à signer, signez-le puis
                            déposez-le.
                          </p>

                          <Button
                            onClick={() =>
                              downloadContract(
                                selectedDemande.contractToSign?.url
                              )
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
                            Déposez ici votre contrat signé et vos documents
                            justificatifs.
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
                          Contrat signé reçu :{" "}
                          {selectedDemande.signedContract.name}
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
                ) : null}
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