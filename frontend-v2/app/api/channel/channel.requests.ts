import { api } from "../api";
import type {
  Channel,
  ChannelPageDetails,
  CreateGroupDmRequest,
} from "./channel.types";

export async function getPrivateChannelList(): Promise<Channel[]> {
  const { data } = await api.get<Channel[]>("/channel");
  return data;
}

export async function getChannelByFriendId(friendId: string): Promise<Channel> {
  const { data } = await api.get<Channel>(`/channel/friend/${friendId}`);
  return data;
}

export async function getChannelList(
  channelId: string,
): Promise<ChannelPageDetails> {
  const { data } = await api.get<ChannelPageDetails>(`/channel/${channelId}`);
  return data;
}

export async function createDm(memberId: string): Promise<Channel> {
  const { data } = await api.post<Channel>("/channel/dm", { memberId });
  return data;
}

export async function createGroupDm(
  body: CreateGroupDmRequest,
): Promise<Channel> {
  const { data } = await api.post<Channel>("/channel/group-dm", body);
  return data;
}
