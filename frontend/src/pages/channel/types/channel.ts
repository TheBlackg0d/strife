export type ChannelType = "DM" | "GROUP_DM" | "GUILD_TEXT";

export interface User {
  id: string;
  username: string;
}

export interface MediaAttachment {
  fileId: string;
  url: string;
  contentType: string | null;
  originalName: string | null;
}

export interface MediaRequest {
  fileId: string;
  contentType: string | null;
  originalName: string | null;
}

export interface Message {
  id: string;
  channelId: string;
  content: string;
  media: MediaAttachment[] | null;
  sender: User;
  timestamp: string;
  editedAt: string | null;
}

export interface MessageRequest {
  channelId: string;
  content: string;
  media: MediaRequest[] | null;
}

export type MessageActionType = "CREATED" | "UPDATED" | "DELETED";

export interface MessageWebSocketMessage {
  messageId: string;
  channelId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  sentAt: string;
  editedAt: string | null;
  media: MediaAttachment[] | null;
}

export interface MessageBroadcast {
  actionType: MessageActionType;
  message: MessageWebSocketMessage;
}

export interface Channel {
  id: string;
  title: string;
  ownerId: string | null;
  guildId: string | null;
}

export type ChannelPageDetails = {
  channel: Channel;
  messages: Message[];
  participants: User[];
  currentUserId: string;
  isGroupChannel: boolean;
};
