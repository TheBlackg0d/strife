import type { IconType } from "react-icons";
import type { PresenceStatus, Profile } from "../profile/profile.types";
import type { MutationFunc } from "~/shared/types";

export type GuildMember = Pick<Profile, "id" | "username">;

export type Guild = {
  id: string;
  name: string;
  guildPicture: string | null;
};

export type GuildDataForCreateModal = {
  owner: Profile;
  friends: Profile[];
  guildName: string;
};

export type GuildChannelType = "TEXT" | "VOICE";

export type GuildChannel = {
  id: string;
  name: string;
  type: GuildChannelType;
};

export type GuildDetails = Guild & {
  members: GuildMember[];
  channels: GuildChannel[];
};

export type Conversation = {
  id: string;
  name: string;
  statusPreference?: PresenceStatus;
  memberCount?: number;
  imageUrl?: string;
  icon?: IconType;
};

export type GuildFormData = {
  owner: GuildMember;
  name: string;
  members: GuildMember[];
};

export type GuildMutation = MutationFunc<GuildDetails>;
