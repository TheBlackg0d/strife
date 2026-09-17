import { useState } from "react";
import AddFriendForm from "./components/AddFriendForm";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { DashboardTab, Friend, FriendFilter } from "./types/dashboard";

import { useGetFriendsQuery } from "@/services/friend-api";
import { useGetPrivateChannelListQuery } from "@/services/channel-api";
import type { Channel } from "@/pages/channel/types/channel";
import { useSubscription } from "@/hook/useStomp";
import { useGetProfileQuery } from "@/services/profile-api";
import { useAppDispatch } from "@/store/hooks";
import { strifeApi } from "@/services/strife-api";

const sectionTitles: Record<FriendFilter, string> = {
  ONLINE: "EN LIGNE",
  ALL: "TOUS LES AMIS",
  PENDING_FRIEND_REQUEST_RECEIVED: "EN ATTENTE",
  PENDING_FRIEND_REQUEST_SENT: "DEMANDES ENVOYÉES",
  BLOCKED: "BLOQUÉS",
};

const emptyMessages: Record<FriendFilter, string> = {
  ONLINE: "Personne n'est en ligne pour le moment.",
  ALL: "Vous n'avez pas encore d'amis.",
  PENDING_FRIEND_REQUEST_RECEIVED: "Aucune demande en attente.",
  PENDING_FRIEND_REQUEST_SENT: "Aucune demande envoyée.",
  BLOCKED: "Vous n'avez bloqué personne.",
};

export const filters: { value: FriendFilter; label: string; count?: number }[] =
  [
    { value: "ONLINE", label: "En ligne" },
    { value: "ALL", label: "Tous" },
    { value: "PENDING_FRIEND_REQUEST_RECEIVED", label: "En attente" },
    { value: "PENDING_FRIEND_REQUEST_SENT", label: "Envoyées" },
    { value: "BLOCKED", label: "Bloqués" },
  ];

function DashBoard() {
  const { data: profile } = useGetProfileQuery();
  const { data: friends } = useGetFriendsQuery();

  filters[2].count =
    friends?.PENDING_FRIEND_REQUEST_RECEIVED.length === 0
      ? undefined
      : friends?.PENDING_FRIEND_REQUEST_RECEIVED.length;
  filters[3].count =
    friends?.PENDING_FRIEND_REQUEST_SENT.length === 0
      ? undefined
      : friends?.PENDING_FRIEND_REQUEST_SENT.length;

  const dispatch = useAppDispatch();

  const [tab, setTab] = useState<DashboardTab>("ONLINE");

  const onMessage = () => {
    dispatch(strifeApi.util.invalidateTags(["Friends"]));
  };

  useSubscription(
    profile ? `/topic/relationship.${profile.id}` : null,
    onMessage,
  );

  if (!friends) {
    return null;
  }

  return (
    <>
      <FriendsHeader activeTab={tab} onTabChange={setTab} />

      {tab === "ADD_FRIEND" ? (
        <AddFriendForm />
      ) : (
        <FriendList filter={tab} friends={friends} />
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

export default DashBoard;
