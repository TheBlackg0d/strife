import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriendsQueryOptions,
  acceptFriendRequestMutationOptions,
  sendFriendRequestMutationOptions,
  removeFriendMutationOptions,
  blockFriendMutationOptions,
} from "./friend.keys";

export function useFriends() {
  return useQuery(getFriendsQueryOptions());
}

function useInvalidateFriends() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: getFriendsQueryOptions().queryKey,
    });
}

export function useAcceptFriendRequest() {
  const onSuccess = useInvalidateFriends();

  const onError = (error: unknown) => {
    console.error("Failed to accept friend request:", error);
  };

  return useMutation(
    acceptFriendRequestMutationOptions({ onSuccess, onError }),
  );
}

export function useSendFriendRequest() {
  const onSuccess = useInvalidateFriends();

  const onError = (error: unknown) => {
    console.error("Failed to send friend request:", error);
  };

  return useMutation(sendFriendRequestMutationOptions({ onSuccess, onError }));
}

export function useRemoveFriend() {
  const onSuccess = useInvalidateFriends();

  const onError = (error: unknown) => {
    console.error("Failed to remove friend:", error);
  };

  return useMutation(removeFriendMutationOptions({ onSuccess, onError }));
}

export function useBlockFriend() {
  const onSuccess = useInvalidateFriends();

  const onError = (error: unknown) => {
    console.error("Failed to block friend:", error);
  };

  return useMutation(blockFriendMutationOptions({ onSuccess, onError }));
}
