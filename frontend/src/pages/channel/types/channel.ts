export type ChannelType = "DM" | "GROUP_DM" | "GUILD_TEXT";

export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  channelId: string;
  content: string;
  media: string | null;
  sender: User;
  timestamp: string;
  editedAt: string | null;
}

export interface MessageRequest {
  channelId: string;
  content: string;
  media: string | null;
}

export interface MessageWebSocketMessage {
  messageId: string;
  channelId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  sentAt: string;
  editAt?: String;
}

export interface Channel {
  id: string;
  type: ChannelType;
  name: string | null;
  ownerId: string | null;
  guildId: string | null;
  showChannel: boolean;
  users: User[];
}

export function isGroupChannel(channel: Channel): boolean {
  return channel.type === "GROUP_DM";
}

export function otherUser(
  channel: Channel,
  currentUserId?: string,
): User | undefined {
  return channel.users.find((user) => user.id !== currentUserId);
}

export function channelTitle(channel: Channel, currentUserId?: string): string {
  if (isGroupChannel(channel)) {
    return channel.name ?? "Groupe privé";
  }
  return otherUser(channel, currentUserId)?.username ?? "Conversation";
}
