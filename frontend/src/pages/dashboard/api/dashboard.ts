import type { Friend, FriendFilter, Relationship } from "../types/dashboard";
import { api } from "../../../api/api";

const getFriendList = async (): Promise<Record<FriendFilter, Friend[]>> => {
  const res = await api.get<Record<FriendFilter, Friend[]>>(
    "relationships/friends",
  );
  return res.data;
};

const acceptFriendRequest = async (friendId: string): Promise<Relationship> => {
  const res = await api.post<Relationship>(
    `relationships/friends/${friendId}/accept`,
  );
  return res.data;
};

const sendFriendRequest = async (username: string): Promise<Relationship> => {
  const res = await api.post<Relationship>("relationships/friends", {
    username,
  });
  return res.data;
};

const removeFriend = async (friendId: string): Promise<void> => {
  await api.post(`relationships/friends/${friendId}/remove`);
};

const blockFriend = async (friendId: string): Promise<Relationship> => {
  const res = await api.post<Relationship>(
    `relationships/friends/${friendId}/block`,
  );
  return res.data;
};

export {
  getFriendList,
  sendFriendRequest,
  removeFriend,
  blockFriend,
  acceptFriendRequest,
};
