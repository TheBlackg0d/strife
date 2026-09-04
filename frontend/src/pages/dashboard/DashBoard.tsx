import { useState } from "react";
import AddFriendForm from "./components/AddFriendForm";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { DashboardTab, Friend, FriendFilter } from "./types/dashboard";

import createFriendListQueryOptions from "./query-options/friend-list-query-option";
import {
  useAcceptFriendRequestMutation,
  useBlockFriendMutation,
  useGetFriendsQuery,
  useRemoveFriendMutation,
} from "../../services/friend-api";

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

function DashBoard() {
  const { data: friends } = useGetFriendsQuery();
  const [tab, setTab] = useState<DashboardTab>("ONLINE");

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
}

function FriendList({ filter, friends }: FriendListProps) {
  const [acceptFriendRequestMutation] = useAcceptFriendRequestMutation();
  const [removeFriendMutation] = useRemoveFriendMutation();
  const [blockFriendMutation] = useBlockFriendMutation();

  const visibleFriends = friends?.[filter] ?? [];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8">
      <h2 className="mb-4 font-label text-xs font-bold text-outline">
        {sectionTitles[filter]} — {visibleFriends.length}
      </h2>

      {visibleFriends.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {visibleFriends.map((friend) => (
            <FriendRow
              key={friend.id}
              friend={friend}
              isInFriendRequestArea={
                filter === "PENDING_FRIEND_REQUEST_RECEIVED"
              }
              isBlocked={filter === "BLOCKED"}
              onRemoveFriend={(friendId) => removeFriendMutation(friendId)}
              onUnblockFriend={(friendId) => removeFriendMutation(friendId)}
              onBlockFriend={(friendId) => blockFriendMutation(friendId)}
              onAcceptFriendRequest={(friendId) =>
                acceptFriendRequestMutation(friendId)
              }
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-outline">{emptyMessages[filter]}</p>
      )}
    </div>
  );
}

export default DashBoard;
