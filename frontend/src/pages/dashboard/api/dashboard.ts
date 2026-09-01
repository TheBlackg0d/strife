import type { Friend, FriendFilter, Relationship } from "../types/dashboard";
import { api } from "../../../api/api";

const getFriendList = async (): Promise<Record<FriendFilter, Friend[]>> => {
  const res = await api.get<Record<FriendFilter, Friend[]>>(
    "relationships/friends",
  );
  return res.data;
};

const sendFriendRequest = async (username: string): Promise<Relationship> => {
  const res = await api.post<Relationship>("relationships/friends", {
    username,
  });
  return res.data;
};

export { getFriendList, sendFriendRequest };
