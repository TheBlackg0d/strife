import { api } from "../api";
import type { Friend, FriendFilter, Relationship } from "./friend.types";
import type { FriendDataForDashboard } from "~/routes/app/_index/types";

export async function getFriends(): Promise<FriendDataForDashboard> {
  const { data } = await api.get<FriendDataForDashboard>(
    "relationships/friends",
  );
  return data;
}

export async function acceptFriendRequest(
  friendId: string,
): Promise<Relationship> {
  const { data } = await api.post<Relationship>(
    `relationships/friends/${friendId}/accept`,
  );
  return data;
}

export async function sendFriendRequest(
  username: string,
): Promise<Relationship> {
  const { data } = await api.post<Relationship>("relationships/friends", {
    username,
  });
  return data;
}

export async function removeFriend(friendId: string): Promise<Relationship> {
  const { data } = await api.delete<Relationship>(
    `relationships/friends/${friendId}/remove`,
  );
  return data;
}

export async function blockFriend(friendId: string): Promise<Relationship> {
  const { data } = await api.post<Relationship>(
    `relationships/friends/${friendId}/block`,
  );
  return data;
}
