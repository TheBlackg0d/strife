import type { Account } from "../auth/auth.types";
import type { IconType } from "react-icons";
import type { MutationFunc } from "~/shared/types";

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

export type Profile = Account & {
  tag?: string;
  statusPreference: PresenceStatus;
  imageUrl?: string;
  icon?: IconType;
  isBot?: boolean;
  bio?: string;
};

export type ProfileFormValues = Pick<Profile, "username" | "email"> & {
  bio: string;
};

export type ProfileMutation = MutationFunc<Profile>;
