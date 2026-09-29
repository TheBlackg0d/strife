import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  createMessage,
  deleteMessage,
  getMessagesForChannel,
  toggleReaction,
  updateMessage,
} from "./message.requests";
import type {
  DeleteMessageMutation,
  DeleteMessageRequest,
  MessageMutation,
  MessageRequest,
  ReactionMutation,
  ReactionRequest,
  UpdateMessageRequest,
} from "./message.types";

export enum MessageKeys {
  MESSAGE = "MESSAGE",
  CREATE_MESSAGE = "CREATE_MESSAGE",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
  DELETE_MESSAGE = "DELETE_MESSAGE",
  TOGGLE_REACTION = "TOGGLE_REACTION",
}

export function getMessagesQueryOptions(channelId: string) {
  return queryOptions({
    queryKey: [MessageKeys.MESSAGE, channelId],
    queryFn: () => getMessagesForChannel(channelId),
    enabled: !!channelId,
  });
}

export function createMessageMutationOptions(callbacks?: MessageMutation) {
  return mutationOptions({
    mutationKey: [MessageKeys.CREATE_MESSAGE],
    mutationFn: (body: MessageRequest) => createMessage(body),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function updateMessageMutationOptions(callbacks?: MessageMutation) {
  return mutationOptions({
    mutationKey: [MessageKeys.UPDATE_MESSAGE],
    mutationFn: (request: UpdateMessageRequest) => updateMessage(request),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function deleteMessageMutationOptions(
  callbacks?: DeleteMessageMutation,
) {
  return mutationOptions({
    mutationKey: [MessageKeys.DELETE_MESSAGE],
    mutationFn: (request: DeleteMessageRequest) => deleteMessage(request),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function toggleReactionMutationOptions(callbacks?: ReactionMutation) {
  return mutationOptions({
    mutationKey: [MessageKeys.TOGGLE_REACTION],
    mutationFn: (body: ReactionRequest) => toggleReaction(body),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}
