import type { PresenceStatus } from "~/api/profile/profile.types";
import type { IconType } from "react-icons";
import type { Friend } from "../friend/friend.types";
import type { Message } from "../message/message.types";
import type { MutationFunc } from "~/shared/types";

export type ChannelUser = Pick<Friend, "id" | "username">;

export type Conversation = {
  id: string;
  name: string;
  statusPreference?: PresenceStatus;
  memberCount?: number;
  imageUrl?: string;
  icon?: IconType;
};

export type Channel = {
  id: string;
  channelTitle: string;
  ownerId: string | null;
  guildId: string | null;
  type: ChannelType;
  memberCount: number;
};

export type ChannelType = "GROUP_DM" | "DM";

export type ChannelPageDetails = {
  channel: Channel;
  messages: Message[];
  participants: Friend[];
  currentUserId: string;
  isGroupChannel: boolean;
  friends: Friend[];
};

export type CreateGroupDmRequest = {
  name: string;
  memberIds: string[];
};

export type ChannelMutation = MutationFunc<Channel>;
