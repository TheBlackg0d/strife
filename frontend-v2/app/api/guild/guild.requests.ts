import { api } from "../api";
import type { Guild, GuildDetails, GuildFormData } from "./guild.types";

export async function getGuildList(): Promise<Guild[]> {
  const { data } = await api.get<Guild[]>("/guild/list");
  return data;
}

export async function getGuild(guildId: string): Promise<GuildDetails> {
  const { data } = await api.get<GuildDetails>(`/guild/${guildId}`);
  return data;
}

export async function createGuild(
  guildFormData: GuildFormData,
): Promise<GuildDetails> {
  const { data } = await api.post<GuildDetails>("/guild", guildFormData);
  return data;
}
