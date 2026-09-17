import type { Message, MessageWebSocketMessage } from "@/pages/channel/types/channel";

export function convertMessageWebSocket(
  message: MessageWebSocketMessage,
): Message {
  return {
    id: message.messageId,
    channelId: message.channelId,
    content: message.content,
    media: message.media,
    sender: {
      id: message.senderId,
      username: message.senderUsername,
    },
    timestamp: message.sentAt,
    editedAt: message.editedAt ?? null,
  };
}
