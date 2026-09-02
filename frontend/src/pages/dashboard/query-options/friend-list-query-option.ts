import { queryOptions } from "@tanstack/react-query";
import { getFriendList } from "../api/dashboard";
import type { Friend, FriendFilter } from "../types/dashboard";

export default function createFriendListQueryOptions() {
  return queryOptions<Record<FriendFilter, Friend[]>>({
    queryKey: ["friendList"],
    queryFn: getFriendList,
    staleTime: 1000 * 60 * 5,
  });
}
