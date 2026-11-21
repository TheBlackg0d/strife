import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCreateGuildMutationOptions,
  getGuildListQueryOptions,
  getGuildQueryOptions,
} from "./guild.keys";
import type { Guild, GuildMutation } from "./guild.types";
import { useNavigate } from "react-router";

export function useGuildList() {
  return useQuery(getGuildListQueryOptions());
}

export function useGuild(guildId: string) {
  return useQuery(getGuildQueryOptions(guildId));
}

export function useCreateGuildMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const callbacks: GuildMutation = {
    onSuccess: (data) => {
      const { members, channels, ...guild } = data;
      queryClient.setQueryData<Guild[]>(
        getGuildListQueryOptions().queryKey,
        (oldData) => (oldData ? [...oldData, guild] : [guild]),
      );
      queryClient.setQueryData(getGuildQueryOptions(data.id).queryKey, data);
      navigate(`/guild/${data.id}`);
    },
    onError: (error) => {
      console.error("Failed to create guild:", error);
    },
  };

  return useMutation(getCreateGuildMutationOptions(callbacks));
}
