"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "../components/Header";
import {
  RefreshCw,
  Search,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Download,
  Landmark,
  BarChart3,
  Upload,
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
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  type: string;
  montant: number;
  duree?: number;
  mensualite?: number;
  statut: Statut;
  commentaire?: string;
  message?: string;
  isIndependant?: boolean;
  contractToSign?: UploadedFile | string;
  signedContract?: UploadedFile | string;
  justificatifs?: UploadedFile[] | string[];
  
  timeline?: TimelineEvent[];
  client?: {
    prenom: string;
    nom: string;
    telephone: string;
    email: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    typeClient?: string;
  };
};

export default function Admin() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tous" | Statut>("Tous");

  const [selectedId, setSelectedId] = useState("");
  const [newStatut, setNewStatut] = useState<Statut>("En cours");
  const [commentaire, setCommentaire] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuthenticated");
    if (savedAuth === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const loginAdmin = async () => {
    if (!adminPassword.trim()) {
      alert("Veuillez entrer le mot de passe administrateur.");
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: adminPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "Accès refusé");
        return;
      }

      sessionStorage.setItem("adminAuthenticated", "true");
      setIsAdminLoggedIn(true);
    } catch {
      alert("Erreur serveur");
    }
  };

  const logoutAdmin = () => {
  sessionStorage.removeItem("adminAuthenticated");
  setIsAdminLoggedIn(false);
  setAdminPassword("");
  setSelectedId("");
};



  const loadDemandes = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/demandes", {
        cache: "no-store",
      });

      const data = await res.json();
      setDemandes(data);
    } catch (error) {
      console.error("Erreur chargement :", error);
      alert("Erreur lors du chargement des demandes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadDemandes();
    }
  }, [isAdminLoggedIn]);

  const selectedDemande = demandes.find((d) => d.id === selectedId);

  useEffect(() => {
    if (selectedDemande) {
      setNewStatut(selectedDemande.statut);
      setCommentaire(selectedDemande.commentaire || "");
    }
  }, [selectedDemande]);

  const filteredDemandes = useMemo(() => {
    return demandes
      .filter((d) => {
        const clientName = `${d.client?.prenom || ""} ${d.client?.nom || ""}`;

        const matchesSearch =
          d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.client?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "Tous" || d.statut === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || "").getTime();
        const dateB = new Date(b.createdAt || b.date || "").getTime();

        return dateB - dateA;
      });
  }, [demandes, searchTerm, statusFilter]);

  const stats = {
    total: demandes.length,
    enCours: demandes.filter((d) => d.statut === "En cours").length,
    acceptes: demandes.filter((d) => d.statut === "Accepté").length,
    refuses: demandes.filter((d) => d.statut === "Refusé").length,
    montantTotal: demandes.reduce((sum, d) => sum + Number(d.montant || 0), 0),
  };

  const updateStatut = async () => {
    if (!selectedId) {
      alert("Sélectionnez une demande");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await fetch("/api/demandes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedId,
          statut: newStatut,
          commentaire,
          timelineEvent: {
            type: "status",
            title: `Statut mis à jour : ${newStatut}`,
            description: commentaire?.trim()
  ? commentaire
  : newStatut === "Documents reçus"
  ? "Nous confirmons la réception de vos documents. Votre dossier passe en phase de contrôle administratif."
  : newStatut === "Vérification finale"
  ? "Votre dossier est actuellement en vérification finale de conformité avant validation définitive."
  : newStatut === "Accepté"
  ? "Votre dossier est validé. Les modalités administratives de mise à disposition sont en préparation."
  : newStatut === "Décaissement en préparation"
  ? "Votre dossier est validé. La préparation administrative du décaissement est en cours."
  : newStatut === "Fonds mis à disposition"
  ? "Les fonds sont désormais mis à votre disposition dans votre espace dossier sécurisé."
  : newStatut === "Fonds transférés"
  ? "Le transfert de vos fonds a été effectué avec succès selon les modalités prévues."
  : newStatut === "Refusé"
  ? "Après analyse, votre dossier n’a pas pu être validé."
  : `Votre dossier est désormais : ${newStatut}.`,
          },
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "Erreur lors de la mise à jour");
        return;
      }

      await loadDemandes();
      alert("✅ Statut mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadDocument = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "contract_to_sign" | "justificatifs"
  ) => {
    if (!selectedId) {
      alert("Sélectionnez une demande");
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("demandeId", selectedId);
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
        alert(result.error || "Erreur lors de l’upload");
        return;
      }

      await loadDemandes();
      alert("✅ Document ajouté avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur upload serveur");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

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

const getStatusIcon = (statut: Statut) => {
  switch (statut) {
    case "Accepté":
      return <CheckCircle className="w-4 h-4" />;

    case "Fonds transférés":
      return <Landmark className="w-4 h-4" />;

    case "Fonds mis à disposition":
    case "Décaissement en préparation":
      return <CreditCard className="w-4 h-4" />;

    case "Documents reçus":
    case "Vérification finale":
      return <FileText className="w-4 h-4" />;

    case "Refusé":
      return <XCircle className="w-4 h-4" />;

    default:
      return <Clock className="w-4 h-4" />;
  }
};

  const formatDate = (d?: Demande) => {
    if (!d) return "—";
    if (d.createdAt) return new Date(d.createdAt).toLocaleDateString("fr-FR");
    if (d.date) return d.date;
    return "—";
  };

  const formatFile = (file: UploadedFile | string): UploadedFile => {
    if (typeof file === "string") {
      return {
        name: file,
        url: "",
        uploadedAt: "",
      };
    }

    return file;
  };

  const contractToSign: UploadedFile | null = selectedDemande?.contractToSign
  ? formatFile(selectedDemande.contractToSign)
  : null;

const signedContract: UploadedFile | null = selectedDemande?.signedContract
  ? formatFile(selectedDemande.signedContract)
  : null;

const justificatifs =
  selectedDemande?.justificatifs?.map((file) => formatFile(file)) || [];

  if (!isAdminLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl">
          <h1 className="text-3xl font-bold mb-3">Accès administrateur</h1>

          <p className="text-zinc-400 mb-6">
            Entrez le mot de passe admin pour accéder au back-office.
          </p>

          <Input
            type="password"
            placeholder="Mot de passe administrateur"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="h-14 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl"
          />

          <Button
            onClick={loginAdmin}
            className="w-full h-14 mt-5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
          >
            Se connecter
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white pt-28 pb-20 relative overflow-hidden">
      <Header />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98124,transparent_35%),radial-gradient(circle_at_bottom_right,#2563eb24,transparent_40%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <Badge className="mb-5 bg-white/10 border border-white/10 text-zinc-300">
              Back-office sécurisé
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Administration Essor Crédit
            </h1>

            <p className="text-zinc-400 mt-4 text-lg">
              Suivi, analyse et gestion des demandes clients.
            </p>
          </div>

           <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={loadDemandes}
            disabled={isLoading}
            className="h-12 px-6 rounded-2xl bg-white text-black hover:bg-zinc-200"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Actualiser
          </Button>

          <Button

    onClick={logoutAdmin}

    variant="outline"

    className="h-12 px-6 rounded-2xl border-red-500/30 text-red-300 hover:bg-red-500/10"

  >

    Déconnexion

  </Button>


        </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <Card className="bg-white/10 border-white/10 rounded-[2rem]">
            <CardContent className="p-6">
              <BarChart3 className="w-7 h-7 text-emerald-300 mb-5" />
              <p className="text-zinc-400">Total dossiers</p>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-400/20 rounded-[2rem]">
            <CardContent className="p-6">
              <Clock className="w-7 h-7 text-amber-300 mb-5" />
              <p className="text-amber-300">En cours</p>
              <p className="text-4xl font-bold mt-2">{stats.enCours}</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/10 border-emerald-400/20 rounded-[2rem]">
            <CardContent className="p-6">
              <CheckCircle className="w-7 h-7 text-emerald-300 mb-5" />
              <p className="text-emerald-300">Acceptées</p>
              <p className="text-4xl font-bold mt-2">{stats.acceptes}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-500/10 border-red-400/20 rounded-[2rem]">
            <CardContent className="p-6">
              <XCircle className="w-7 h-7 text-red-300 mb-5" />
              <p className="text-red-300">Refusées</p>
              <p className="text-4xl font-bold mt-2">{stats.refuses}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 rounded-[2rem] col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <Landmark className="w-7 h-7 text-emerald-300 mb-5" />
              <p className="text-zinc-400">Volume total</p>
              <p className="text-2xl font-bold mt-2">
                {stats.montantTotal.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                  <CardTitle className="text-white">
                    Liste des demandes
                  </CardTitle>

                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="Rechercher dossier, client, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 md:w-72 bg-black/20 border-white/10 text-white rounded-2xl"
                      />
                    </div>

                    <Select
                      value={statusFilter}
                      onValueChange={(v: "Tous" | Statut) =>
                        setStatusFilter(v)
                      }
                    >
                      <SelectTrigger className="h-12 md:w-44 bg-black/20 border-white/10 text-white rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>

  <SelectItem value="En cours">⏳ En cours</SelectItem>

  <SelectItem value="Documents reçus">📄 Documents reçus</SelectItem>

  <SelectItem value="Vérification finale">🔎 Vérification finale</SelectItem>

  <SelectItem value="Accepté">✅ Accepté</SelectItem>

  <SelectItem value="Décaissement en préparation">🏦 Décaissement</SelectItem>

  <SelectItem value="Fonds mis à disposition">💳 Mise à disposition</SelectItem>

  <SelectItem value="Fonds transférés">💸 Fonds transférés</SelectItem>

  <SelectItem value="Refusé">❌ Refusé</SelectItem>

</SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {isLoading ? (
                  <p className="text-center py-16 text-zinc-400">
                    Chargement des demandes...
                  </p>
                ) : filteredDemandes.length === 0 ? (
                  <p className="text-center py-16 text-zinc-400">
                    Aucune demande trouvée.
                  </p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {filteredDemandes.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedId(d.id)}
                        className={`w-full text-left p-5 md:p-6 transition ${
                          selectedId === d.id
                            ? "bg-emerald-500/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono text-xs text-zinc-500">
                                {d.id}
                              </span>

                              <Badge className={getBadgeClass(d.statut)}>
                                <span className="flex items-center gap-1.5">
                                  {getStatusIcon(d.statut)}
                                  {d.statut}
                                </span>
                              </Badge>
                            </div>

                            <p className="text-lg font-semibold">
                              {d.client
                                ? `${d.client.prenom} ${d.client.nom}`
                                : "Client non renseigné"}
                            </p>

                            <p className="text-sm text-zinc-500 mt-1">
                              {d.type} · {formatDate(d)}
                            </p>
                          </div>

                          <div className="md:text-right">
                            <p className="text-2xl font-bold">
                              {d.montant.toLocaleString("fr-FR")} €
                            </p>

                            <p className="text-sm text-zinc-500">
                              {d.client?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="bg-white/10 border-white/10 backdrop-blur-2xl rounded-[2rem] sticky top-28 overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white">
                  Détails du dossier
                </CardTitle>
              </CardHeader>

              <CardContent className="p-7 space-y-6">
                {selectedDemande ? (
                  <>
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="font-mono text-xs text-zinc-500 mb-2">
                          {selectedDemande.id}
                        </p>

                        <h2 className="text-3xl font-bold">
                          {selectedDemande.montant.toLocaleString("fr-FR")} €
                        </h2>

                        <p className="text-zinc-400 mt-1">
                          {selectedDemande.type}
                        </p>
                      </div>

                      <Badge className={getBadgeClass(selectedDemande.statut)}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(selectedDemande.statut)}
                          {selectedDemande.statut}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                        <p className="text-zinc-500 text-sm">Date</p>
                        <p className="font-semibold mt-1">
                          {formatDate(selectedDemande)}
                        </p>
                      </div>

                      <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                        <p className="text-zinc-500 text-sm">Profil</p>
                        <p className="font-semibold mt-1">
                          {selectedDemande.isIndependant
                            ? "Indépendant"
                            : "Particulier"}
                        </p>
                      </div>

                      <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                        <p className="text-zinc-500 text-sm">Durée</p>
                        <p className="font-semibold mt-1">
                          {selectedDemande.duree || "—"} mois
                        </p>
                      </div>

                      <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                        <p className="text-zinc-500 text-sm">Mensualité</p>
                        <p className="font-semibold mt-1">
                          {selectedDemande.mensualite
                            ? `${selectedDemande.mensualite.toLocaleString(
                                "fr-FR"
                              )} €`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {selectedDemande.client && (
                      <div className="bg-black/20 border border-white/10 rounded-3xl p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="w-5 h-5 text-emerald-300" />
                          Informations client
                        </h3>

                        <div className="space-y-3 text-sm">
                          <p className="flex items-center gap-3 text-zinc-300">
                            <User className="w-4 h-4 text-zinc-500" />
                            {selectedDemande.client.prenom}{" "}
                            {selectedDemande.client.nom}
                          </p>

                          <p className="flex items-center gap-3 text-zinc-300">
                            <Mail className="w-4 h-4 text-zinc-500" />
                            {selectedDemande.client.email}
                          </p>

                          <p className="flex items-center gap-3 text-zinc-300">
                            <Phone className="w-4 h-4 text-zinc-500" />
                            {selectedDemande.client.telephone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-black/20 border border-white/10 rounded-3xl p-6 space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-300" />
                        Documents reçus
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 cursor-pointer text-sm font-medium">
                          <Upload className="w-4 h-4" />
                          {isUploading ? "Upload..." : "Contrat à signer"}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              uploadDocument(e, "contract_to_sign")
                            }
                          />
                        </label>

                        <label className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center gap-2 cursor-pointer text-sm font-medium">
                          <Upload className="w-4 h-4" />
                          Ajouter document reçu
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => uploadDocument(e, "justificatifs")}
                          />
                        </label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 bg-white/5 rounded-2xl p-4">
                          <div>
                            <p className="text-sm font-medium">
                              Contrat à signer
                            </p>
                            <p className="text-xs text-zinc-500">
                              {contractToSign?.name || "Non reçu"}
                            </p>
                          </div>

                          {contractToSign?.url ? (
  <a
    href={contractToSign.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center hover:bg-emerald-500/25"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <Badge className="bg-zinc-700 text-zinc-300">
                              En attente
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4 bg-white/5 rounded-2xl p-4">
  <div>
    <p className="text-sm font-medium">Contrat signé reçu</p>
    <p className="text-xs text-zinc-500">
      {signedContract?.name || "Non reçu"}
    </p>
  </div>

  {signedContract?.url ? (
    <a
      href={signedContract.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center hover:bg-emerald-500/25"
    >
      <Download className="w-4 h-4" />
    </a>
  ) : (
    <Badge className="bg-zinc-700 text-zinc-300">En attente</Badge>
  )}
</div>

                        {justificatifs.length > 0 ? (
                          justificatifs.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-4 bg-white/5 rounded-2xl p-4"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  Justificatif {index + 1}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {file.name}
                                </p>
                              </div>

                              {file.url && (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center hover:bg-emerald-500/25"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="bg-white/5 rounded-2xl p-4 text-sm text-zinc-500">
                            Aucun justificatif reçu.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm text-zinc-400">
                        Nouveau statut
                      </label>

                      <Select
                        value={newStatut}
                        onValueChange={(v: Statut) => setNewStatut(v)}
                      >
                        <SelectTrigger className="h-14 bg-black/20 border-white/10 text-white rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="En cours">⏳ En cours</SelectItem>
                          <SelectItem value="Accepté">✅ Accepté</SelectItem>
                          <SelectItem value="Refusé">❌ Refusé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm text-zinc-400">
                        Commentaire client
                      </label>

                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                        <textarea
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          className="w-full h-32 bg-black/20 border border-white/10 rounded-3xl p-5 pl-12 outline-none focus:border-emerald-400 text-white"
                          placeholder="Message visible par le client..."
                        />
                      </div>
                    </div>

                    <Button
                      onClick={updateStatut}
                      disabled={isUpdating}
                      className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
                    >
                      <ShieldCheck className="mr-2 w-5 h-5" />
                      {isUpdating
                        ? "Mise à jour..."
                        : "Enregistrer le changement"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-14">
                    <CreditCard className="w-14 h-14 mx-auto text-zinc-600 mb-5" />
                    <p className="text-zinc-400">
                      Sélectionnez une demande pour afficher les détails.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}