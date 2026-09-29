import { api } from "../api";
import type {
  DeleteMessageRequest,
  Message,
  MessageRequest,
  ReactionRequest,
  UpdateMessageRequest,
} from "./message.types";

export async function getMessagesForChannel(
  channelId: string,
): Promise<Message[]> {
  const { data } = await api.get<Message[]>(`/message/${channelId}`);
  return data;
}

export async function createMessage(body: MessageRequest): Promise<Message> {
  const { data } = await api.post<Message>("/message/create", body);
  return data;
}

export async function updateMessage({
  messageId,
  payload,
}: UpdateMessageRequest): Promise<Message> {
  const { data } = await api.put<Message>(
    `/message/update/${messageId}`,
    payload,
  );
  return data;
}

export async function deleteMessage({
  messageId,
}: DeleteMessageRequest): Promise<void> {
  await api.delete(`/message/${messageId}`);
}

export async function toggleReaction(body: ReactionRequest): Promise<void> {
  await api.post(`/message/${body.messageId}/reaction/reaction`, body);
}
