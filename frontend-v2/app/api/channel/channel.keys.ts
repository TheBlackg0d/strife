import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  createDm,
  createGroupDm,
  getChannelList,
  getPrivateChannelList,
  getChannelByFriendId,
} from "./channel.requests";
import type { ChannelMutation, Channel } from "./channel.types";
import type { CreateGroupDmRequest } from "./channel.types";

export enum ChannelKeys {
  CHANNEL = "CHANNEL",
  PRIVATE_LIST = "PRIVATE_LIST",
  CREATE_DM = "CREATE_DM",
  CREATE_GROUP_DM = "CREATE_GROUP_DM",
}

export function getPrivateChannelListQueryOptions() {
  return queryOptions({
    queryKey: [ChannelKeys.PRIVATE_LIST],
    queryFn: () => getPrivateChannelList(),
    staleTime: Infinity,
  });
}

export function getChannelQueryOptions(channelId: string) {
  return queryOptions({
    queryKey: [ChannelKeys.CHANNEL, channelId],
    queryFn: () => getChannelList(channelId),
    staleTime: Infinity,
  });
}

export function getChannelByFriendIdQueryOptions(
  friendId: string | null,
  callback?: (data: Channel) => void,
) {
  return queryOptions({
    queryKey: [ChannelKeys.CHANNEL, "friend", friendId],
    queryFn: () => getChannelByFriendId(friendId!),
    enabled: !!friendId,
    select: callback,
  });
}

export function createDmMutationOptions(callbacks?: ChannelMutation) {
  return mutationOptions({
    mutationKey: [ChannelKeys.CREATE_DM],
    mutationFn: (memberId: string) => createDm(memberId),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function createGroupDmMutationOptions(callbacks?: ChannelMutation) {
  return mutationOptions({
    mutationKey: [ChannelKeys.CREATE_GROUP_DM],
    mutationFn: (body: CreateGroupDmRequest) => createGroupDm(body),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}
