import type { IconType } from "react-icons";
import type {
  PresenceStatus,
  Profile,
  RelationshipStatus,
} from "../../../types/profile";

export interface Guild {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: IconType;
}

export type Friend = Profile;

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

export type FriendFilter =
  | "PENDING_FRIEND_REQUEST_SENT"
  | "PENDING_FRIEND_REQUEST_RECEIVED"
  | "ONLINE"
  | "ALL"
  | "BLOCKED";


export type DashboardTab = FriendFilter | "ADD_FRIEND";


export interface Relationship {
  friend1: Friend;
  friend2: Friend;
  status: RelationshipStatus;
}
