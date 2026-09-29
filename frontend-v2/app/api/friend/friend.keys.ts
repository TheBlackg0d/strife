import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  blockFriend,
  getFriends,
  removeFriend,
  sendFriendRequest,
} from "./friend.requests";
import type { FriendMutation } from "./friend.types";

export enum FriendKeys {
  FRIEND = "FRIEND",
  ACCEPT_FRIEND_REQUEST = "ACCEPT_FRIEND_REQUEST",
  SEND_FRIEND_REQUEST = "SEND_FRIEND_REQUEST",
  REMOVE_FRIEND = "REMOVE_FRIEND",
  BLOCK_FRIEND = "BLOCK_FRIEND",
}

export function getFriendsQueryOptions() {
  return queryOptions({
    queryKey: [FriendKeys.FRIEND],
    queryFn: () => getFriends(),
  });
}

export function acceptFriendRequestMutationOptions(callbacks?: FriendMutation) {
  return mutationOptions({
    mutationKey: [FriendKeys.ACCEPT_FRIEND_REQUEST],
    mutationFn: (friendId: string) => acceptFriendRequest(friendId),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function sendFriendRequestMutationOptions(callbacks?: FriendMutation) {
  return mutationOptions({
    mutationKey: [FriendKeys.SEND_FRIEND_REQUEST],
    mutationFn: (username: string) => sendFriendRequest(username),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function removeFriendMutationOptions(callbacks?: FriendMutation) {
  return mutationOptions({
    mutationKey: [FriendKeys.REMOVE_FRIEND],
    mutationFn: (friendId: string) => removeFriend(friendId),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export function blockFriendMutationOptions(callbacks?: FriendMutation) {
  return mutationOptions({
    mutationKey: [FriendKeys.BLOCK_FRIEND],
    mutationFn: (friendId: string) => blockFriend(friendId),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}
