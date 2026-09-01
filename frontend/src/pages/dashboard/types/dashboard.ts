import type { IconType } from "react-icons";

export type PresenceStatus =
  | "ONLINE"
  | "INACTIVE"
  | "INVISIBLE"
  | "DO_NOT_DISTURB"
  | "OFFLINE";

/** Accent used by the small pill in front of an activity line. */
export type ActivityTone = "primary" | "secondary" | "neutral";

export interface Activity {
  /** e.g. "Joue à", "Coding in", "Listening to" */
  verb: string;
  /** Highlighted part, e.g. "Visual Studio Code" */
  target?: string;
  icon?: IconType;
  tone?: ActivityTone;
}

export interface Guild {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: IconType;
}

export interface Friend {
  id: string;
  username: string;
  tag?: string;
  statusPreference: PresenceStatus;
  activity?: Activity;
  imageUrl?: string;
  icon?: IconType;
  isBot?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  statusPreference?: PresenceStatus;
  memberCount?: number;
  imageUrl?: string;
  icon?: IconType;
}

export interface IDashBoard {
  friends: Record<FriendFilter, Friend[]>;
}

export type FriendFilter = "ACCEPTED" | "ALL" | "PENDING" | "BLOCKED";

/** Onglets du dashboard : les filtres d'amis + le formulaire d'ajout. */
export type DashboardTab = FriendFilter | "ADD_FRIEND";

export interface Relationship {
  friend1: Friend;
  friend2: Friend;
  status: FriendFilter;
}
