import type { FriendFilter } from "~/api/friend/friend.types";
import type { Filter } from "./types";

export const sectionTitles: Record<FriendFilter, string> = {
  ONLINE: "EN LIGNE",
  ALL: "TOUS LES AMIS",
  PENDING_FRIEND_REQUEST_RECEIVED: "EN ATTENTE",
  PENDING_FRIEND_REQUEST_SENT: "DEMANDES ENVOYÉES",
  BLOCKED: "BLOQUÉS",
};

export const emptyMessages: Record<FriendFilter, string> = {
  ONLINE: "Personne n'est en ligne pour le moment.",
  ALL: "Vous n'avez pas encore d'amis.",
  PENDING_FRIEND_REQUEST_RECEIVED: "Aucune demande en attente.",
  PENDING_FRIEND_REQUEST_SENT: "Aucune demande envoyée.",
  BLOCKED: "Vous n'avez bloqué personne.",
};

export const filters: Filter[] = [
  { value: "ONLINE", label: "En ligne" },
  { value: "ALL", label: "Tous" },
  { value: "PENDING_FRIEND_REQUEST_RECEIVED", label: "En attente" },
  { value: "PENDING_FRIEND_REQUEST_SENT", label: "Envoyées" },
  { value: "BLOCKED", label: "Bloqués" },
];
