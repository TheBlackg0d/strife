import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesQueryOptions,
  createMessageMutationOptions,
  updateMessageMutationOptions,
  deleteMessageMutationOptions,
  toggleReactionMutationOptions,
} from "./message.keys";
import type {
  ChannelBroadcast,
  Message,
  MessageWebSocketMessage,
  Reaction,
  ReactionWebSocketMessage,
} from "./message.types";
import { useStomp, useSubscription } from "~/shared/hooks/useStomp";

export function useMessages(channelId: string, initialData?: Message[]) {
  return useQuery({ ...getMessagesQueryOptions(channelId), initialData });
}

function useUpsertMessage() {
  const queryClient = useQueryClient();

  return (message: Message) => {
    queryClient.setQueryData<Message[]>(
      getMessagesQueryOptions(message.channelId).queryKey,
      (oldData) => {
        if (!oldData) return [message];

        const index = oldData.findIndex((m) => m.id === message.id);
        if (index === -1) return [...oldData, message];

        return oldData.map((m) => (m.id === message.id ? message : m));
      },
    );
  };
}

function useUpsertReaction() {
  const queryClient = useQueryClient();

  return (reaction: Reaction) => {
    queryClient.setQueryData<Message[]>(
      getMessagesQueryOptions(reaction.channelId).queryKey,
      (oldData) =>
        oldData?.map((m) => {
          if (m.id !== reaction.messageId) return m;

          const hasGroup = m.reactions.some((g) => g.emoji === reaction.emoji);
          const reactions = hasGroup
            ? m.reactions.map((g) =>
                g.emoji === reaction.emoji
                  ? {
                      ...g,
                      count: g.count + 1,
                      reactions: [...g.reactions, reaction],
                    }
                  : g,
              )
            : [
                ...m.reactions,
                { emoji: reaction.emoji, count: 1, reactions: [reaction] },
              ];

          return { ...m, reactions };
        }),
    );
  };
}

function useDeleteReaction() {
  const queryClient = useQueryClient();

  return (reaction: Reaction) => {
    queryClient.setQueryData<Message[]>(
      getMessagesQueryOptions(reaction.channelId).queryKey,
      (oldData) =>
        oldData?.map((m) => {
          if (m.id !== reaction.messageId) return m;

          const reactions = m.reactions
            .map((g) =>
              g.emoji === reaction.emoji
                ? {
                    ...g,
                    count: g.count - 1,
                    reactions: g.reactions.filter(
                      (r) => r.userId !== reaction.userId,
                    ),
                  }
                : g,
            )
            .filter((g) => g.count > 0);

          return { ...m, reactions };
        }),
    );
  };
}

export function useCreateMessage() {
  const onSuccess = useUpsertMessage();

  const onError = (error: unknown) => {
    console.error("Failed to send message:", error);
  };

  return useMutation(createMessageMutationOptions({ onSuccess, onError }));
}

export function useUpdateMessage() {
  const onSuccess = useUpsertMessage();

  const onError = (error: unknown) => {
    console.error("Failed to update message:", error);
  };

  return useMutation(updateMessageMutationOptions({ onSuccess, onError }));
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  const onError = (error: unknown) => {
    console.error("Failed to delete message:", error);
  };

  return useMutation({
    ...deleteMessageMutationOptions({ onError }),
    onSuccess: (_data, { messageId, channelId }) => {
      queryClient.setQueryData<Message[]>(
        getMessagesQueryOptions(channelId).queryKey,
        (oldData) => oldData?.filter((m) => m.id !== messageId),
      );
    },
  });
}

function toMessage(message: MessageWebSocketMessage): Message {
  return {
    id: message.messageId,
    channelId: message.channelId,
    content: message.content,
    media: message.media,
    sender: {
      id: message.senderId,
      username: message.senderUsername,
    },
    reactions: [],
    timestamp: message.sentAt,
    editedAt: message.editedAt ?? null,
  };
}

function toReaction(reactionEvent: ReactionWebSocketMessage): Reaction {
  return {
    id: reactionEvent.reactionId,
    emoji: reactionEvent.emoji,
    messageId: reactionEvent.messageId,
    userId: reactionEvent.userId,
    channelId: reactionEvent.channelId,
  };
}

export function useMessageSubscription(channelId: string) {
  const queryClient = useQueryClient();
  const upsertMessage = useUpsertMessage();
  const upsertReaction = useUpsertReaction();
  const deleteReaction = useDeleteReaction();
  const stomp = useStomp();

  useSubscription<ChannelBroadcast>(
    stomp,
    `/topic/channel.${channelId}`,
    (broadcast) => {
      if (!("message" in broadcast)) {
        if (broadcast.actionType === "REACTION_CREATED") {
          upsertReaction(toReaction(broadcast.reactionEvent));
        }

        if (broadcast.actionType === "REACTION_DELETED") {
          deleteReaction(toReaction(broadcast.reactionEvent));
        }

        return;
      }

      const message = toMessage(broadcast.message);

      if (broadcast.actionType === "MESSAGE_DELETED") {
        queryClient.setQueryData<Message[]>(
          getMessagesQueryOptions(channelId).queryKey,
          (oldData) => oldData?.filter((m) => m.id !== message.id),
        );
        return;
      }

      upsertMessage(message);
    },
  );
}

export function useToggleReaction() {
  const onError = (error: unknown) => {
    console.error("Failed to toggle reaction:", error);
  };

  return useMutation(toggleReactionMutationOptions({ onError }));
}
