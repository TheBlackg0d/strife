import { useQueryClient } from "@tanstack/react-query";
import { getChannelQueryOptions } from "~/api/channel/channel.keys";
import { getGuildQueryOptions } from "~/api/guild/guild.keys";
import { getProfileQueryOptions } from "~/api/profile/profile.keys";
import { getQueryClient } from "~/lib/query-client";
import type { Route } from "./+types/route";
import GuildChannelPage from "./components/GuildChannelPage";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const queryClient = getQueryClient();

  const guild = await queryClient.query(getGuildQueryOptions(params.guildId));

  const [channelDetails, profile] = await Promise.all([
    queryClient.query(getChannelQueryOptions(guild.channels[0].id)),
    queryClient.query(getProfileQueryOptions()),
  ]);

  return { guild, channelDetails, profile };
}

export default function GuildChannelRoute({ params }: Route.ComponentProps) {
  const queryClient = useQueryClient();

  const guild = queryClient.getQueryData(
    getGuildQueryOptions(params.guildId).queryKey,
  );

  const channelDetails = queryClient.getQueryData(
    getChannelQueryOptions(guild?.channels[0].id ?? "").queryKey,
  );

  const profile = queryClient.getQueryData(getProfileQueryOptions().queryKey);

  if (!guild || !channelDetails || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[15px] text-outline">
        Ce salon n'existe pas.
      </div>
    );
  }

  return (
    <GuildChannelPage
      guild={guild}
      channelDetails={channelDetails}
      profile={profile}
    />
  );
}
