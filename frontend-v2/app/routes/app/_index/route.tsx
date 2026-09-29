import type { FriendFilter } from "~/api/friend/friend.types";
import type { Friend } from "~/api/friend/friend.types";
import type { Channel } from "~/api/channel/channel.types";
import { getQueryClient } from "~/lib/query-client";
import FriendRow from "./components/FriendRow";
import { emptyMessages, sectionTitles } from "./constants";
import AddFriendForm from "./components/AddFriendForm";
import FriendsHeader from "./components/FriendsHeader";
import { useStomp, useSubscription } from "~/shared/hooks/useStomp";
import { useState } from "react";
import type { DashboardTab } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { getFriendsQueryOptions } from "~/api/friend/friend.keys";
import type { Route } from "./+types/route";
import { getProfileQueryOptions } from "~/api/profile/profile.keys";

export async function clientLoader() {
  const queryClient = getQueryClient();

  const [profile, friends] = await Promise.all([
    queryClient.query({ ...getProfileQueryOptions() }),
    queryClient.query(getFriendsQueryOptions()),
  ]);
  return { profile, friends };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { friends, profile } = loaderData;
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<DashboardTab>("ONLINE");

  const onMessage = () => {
    queryClient.invalidateQueries(getFriendsQueryOptions());
  };

  const stomp = useStomp();

  useSubscription(
    stomp,
    profile ? `/topic/relationship.${profile.id}` : null,
    onMessage,
  );

  if (!friends) {
    return null;
  }

  return (
    <>
      <FriendsHeader
        dashboardData={friends}
        activeTab={tab}
        onTabChange={setTab}
      />

      {tab === "ADD_FRIEND" ? (
        <AddFriendForm />
      ) : (
        <FriendList filter={tab} friends={friends.friendStatusList} />
      )}
    </>
  );
}

interface FriendListProps {
  filter: FriendFilter;
  friends?: Record<FriendFilter, Friend[]>;
  channels?: Channel[];
}

function FriendList({ filter, friends }: FriendListProps) {
  const visibleFriends = friends?.[filter] ?? [];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8">
      <h2 className="mb-4 font-label text-xs font-bold text-outline">
        {sectionTitles[filter]} — {visibleFriends.length}
      </h2>

      {visibleFriends.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {visibleFriends.map((friend) => (
            <FriendRow key={friend.id} friend={friend} friendFilter={filter} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-outline">{emptyMessages[filter]}</p>
      )}
    </div>
  );
}
