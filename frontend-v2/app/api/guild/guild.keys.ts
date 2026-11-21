import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createGuild, getGuild, getGuildList } from "./guild.requests";
import type { GuildMutation } from "./guild.types";

export enum GuildKeys {
  GUILD = "GUILD",
  GUILD_LIST = "GUILD_LIST",
  CREATE_GUILD = "CREATE_GUILD",
}

export function getGuildListQueryOptions() {
  return queryOptions({
    queryKey: [GuildKeys.GUILD_LIST],
    staleTime: Infinity,
    queryFn: getGuildList,
  });
}

export function getGuildQueryOptions(guildId: string) {
  return queryOptions({
    queryKey: [GuildKeys.GUILD, guildId],
    staleTime: Infinity,
    queryFn: () => getGuild(guildId),
  });
}

export function getCreateGuildMutationOptions(callbacks?: GuildMutation) {
  return mutationOptions({
    mutationKey: [GuildKeys.CREATE_GUILD],
    mutationFn: createGuild,
    ...callbacks,
  });
}
