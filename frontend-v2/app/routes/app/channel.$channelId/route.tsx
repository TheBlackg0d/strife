import { getChannelQueryOptions } from "~/api/channel/channel.keys";
import { getProfileQueryOptions } from "~/api/profile/profile.keys";
import type { Route } from "./+types/route";
import { getQueryClient } from "~/lib/query-client";
import ChannelDetailPage from "./components/ChannelDetailPage";
import { useQueryClient } from "@tanstack/react-query";

export async function clientLoader({ params }: Route.ClientActionArgs) {
  const queryClient = getQueryClient();

  const [channelDetails, profile] = await Promise.all([
    queryClient.query(getChannelQueryOptions(params.channelId)),
    queryClient.query(getProfileQueryOptions()),
  ]);
  return { channelDetails, profile };
}

export default function ChannelRoute({ params }: Route.ComponentProps) {
  const queryClient = useQueryClient();

  const channelDetails = queryClient.getQueryData(
    getChannelQueryOptions(params.channelId).queryKey,
  );

  const profile = queryClient.getQueryData(getProfileQueryOptions().queryKey);

  if (!channelDetails || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[15px] text-outline">
        Cette conversation n'existe pas.
      </div>
    );
  }

  return (
    <ChannelDetailPage channelDetails={channelDetails} profile={profile} />
  );
}
