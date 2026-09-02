import type { IconType } from "react-icons";

export interface Profile {
  id: string;
  username: string;
  email: string;
  tag?: string;
  statusPreference: PresenceStatus;
  imageUrl?: string;
  icon?: IconType;
  isBot?: boolean;
}

export type PresenceStatus =
  | "ONLINE"
  | "INACTIVE"
  | "INVISIBLE"
  | "DO_NOT_DISTURB"
  | "OFFLINE";

export type RelationshipStatus =
  | "PENDING"
  | "ACCEPTED"
  | "BLOCKED"
  | "DENIED"
  | "REMOVED";
