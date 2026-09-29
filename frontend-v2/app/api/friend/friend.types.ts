import type { Profile } from "../profile/profile.types";
import type { RelationshipStatus } from "../profile/profile.types";
import type { MutationFunc } from "~/shared/types";

export type FriendFilter =
  | "PENDING_FRIEND_REQUEST_SENT"
  | "PENDING_FRIEND_REQUEST_RECEIVED"
  | "ONLINE"
  | "ALL"
  | "BLOCKED";

export type Friend = Profile;

export interface Relationship {
  friend1: Friend;
  friend2: Friend;
  status: RelationshipStatus;
}

export type FriendMutation = MutationFunc<Relationship>;
