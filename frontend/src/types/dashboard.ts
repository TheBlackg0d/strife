import type { IconType } from "react-icons";

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

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
  status: PresenceStatus;
  activity?: Activity;
  imageUrl?: string;
  icon?: IconType;
  isBot?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  status?: PresenceStatus;
  memberCount?: number;
  imageUrl?: string;
  icon?: IconType;
}

export interface IDashBoard {
  friends: Record<FriendFilter, Friend[]>;
}

export type FriendFilter = "online" | "all" | "pending" | "blocked";
