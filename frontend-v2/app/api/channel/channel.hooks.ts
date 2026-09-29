import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPrivateChannelListQueryOptions,
  getChannelQueryOptions,
  createDmMutationOptions,
  createGroupDmMutationOptions,
  getChannelByFriendIdQueryOptions,
} from "./channel.keys";
import type { Channel } from "./channel.types";
import { useState } from "react";
import { useNavigate } from "react-router";

export function usePrivateChannelList() {
  return useQuery(getPrivateChannelListQueryOptions());
}

export function useChannel(channelId: string) {
  return useQuery(getChannelQueryOptions(channelId));
}

export function useChannelByFriendId() {
  const [id, setId] = useState<string | null>(null);
  const navigate = useNavigate();
  const onSelect = (channel: Channel) => {
    if (channel) {
      navigate(`/channels/${channel.id}`);
    }
  };

  const queryInfo = useQuery(getChannelByFriendIdQueryOptions(id, onSelect));

  const fetchChannelByFriendId = (id: string) => {
    setId(id);
  };

  return { channel: queryInfo.data, fetchChannelByFriendId };
}

export function useCreateDm() {
  const queryClient = useQueryClient();

  const onSuccess = (data: Channel) => {
    queryClient.setQueryData<Channel[]>(
      getPrivateChannelListQueryOptions().queryKey,
      (oldData) => (oldData ? [...oldData, data] : [data]),
    );
  };

  const onError = (error: unknown) => {
    console.error("Failed to create DM:", error);
  };

  return useMutation(createDmMutationOptions({ onSuccess, onError }));
}

export function useCreateGroupDm() {
  const queryClient = useQueryClient();

  const onSuccess = (data: Channel) => {
    queryClient.setQueryData<Channel[]>(
      getPrivateChannelListQueryOptions().queryKey,
      (oldData) => (oldData ? [...oldData, data] : [data]),
    );
  };

  const onError = (error: unknown) => {
    console.error("Failed to create group DM:", error);
  };

  return useMutation(createGroupDmMutationOptions({ onSuccess, onError }));
}
