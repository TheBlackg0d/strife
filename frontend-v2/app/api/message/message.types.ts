import type { Profile } from "../profile/profile.types";
import type { MediaRequest } from "../file/file.types";
import type { MutationFunc } from "~/shared/types";

export type Sender = Pick<Profile, "id" | "username">;

export type Message = {
  id: string;
  channelId: string;
  content: string;
  media: MediaAttachment[] | null;
  sender: Sender;
  reactions: ReactionGroup[];
  timestamp: string;
  editedAt: string | null;
};

export type MessageWithCurrentUserId = Message & {
  currentUserId: string;
};

export type Reaction = {
  id: string;
  userId: string;
  messageId: string;
  channelId: string;
  emoji: string;
};

export type ReactionGroup = {
  emoji: string;
  count: number;
  reactions: Reaction[];
};

export type MessageRequest = Pick<Message, "channelId" | "content"> & {
  media: MediaRequest[] | null;
};

export type UpdateMessageRequest = {
  messageId: string;
  payload: MessageRequest;
};

export type DeleteMessageRequest = Pick<Message, "channelId"> & {
  messageId: string;
};

export type ReactionRequest = {
  channelId: string;
  messageId: string;
  emoji: string;
};

export type MessageMutation = MutationFunc<Message>;

export type DeleteMessageMutation = MutationFunc<void>;

export type ReactionMutation = MutationFunc<void>;

export type MessageActionType =
  | "MESSAGE_CREATED"
  | "MESSAGE_UPDATED"
  | "MESSAGE_DELETED";

export type ReactionActionType = "REACTION_CREATED" | "REACTION_DELETED";

export type MessageWebSocketMessage = {
  messageId: string;
  channelId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  sentAt: string;
  editedAt: string | null;
  media: MediaAttachment[] | null;
};

export type MessageBroadcast = {
  actionType: MessageActionType;
  message: MessageWebSocketMessage;
};

export type ReactionWebSocketMessage = {
  reactionId: string;
  messageId: string;
  userId: string;
  channelId: string;
  emoji: string;
};

export type ReactionBroadcast = {
  actionType: ReactionActionType;
  reactionEvent: ReactionWebSocketMessage;
};

export type ChannelBroadcast = MessageBroadcast | ReactionBroadcast;

export type Media = {
  fileId: string;
  contentType: string | null;
  originalName: string | null;
};

export type MediaAttachment = Media & {
  url: string;
};
