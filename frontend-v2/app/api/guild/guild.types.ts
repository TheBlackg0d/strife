import type { IconType } from "react-icons";
import type { PresenceStatus } from "../profile/profile.types";

export type Guild = {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: IconType;
};

export type Conversation = {
  id: string;
  name: string;
  statusPreference?: PresenceStatus;
  memberCount?: number;
  imageUrl?: string;
  icon?: IconType;
};
