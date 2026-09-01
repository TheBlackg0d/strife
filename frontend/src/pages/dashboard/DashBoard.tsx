import { useState } from "react";
import AddFriendForm from "./components/AddFriendForm";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { DashboardTab, Friend, FriendFilter } from "./types/dashboard";
import { useMutation, useQuery } from "@tanstack/react-query";
import createFriendListQueryOptions from "./types/friend-list-query-option";
import {
  acceptFriendRequest,
  blockFriend,
  removeFriend,
} from "./api/dashboard";
import { queryClient } from "../../main";

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
  const { data: friends } = useQuery(createFriendListQueryOptions());
  const [tab, setTab] = useState<DashboardTab>("ONLINE");

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
  const invalidateFriendList = () =>
    queryClient.invalidateQueries({
      queryKey: createFriendListQueryOptions().queryKey,
    });

  const acceptFriendRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: invalidateFriendList,
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: invalidateFriendList,
  });

  const blockFriendMutation = useMutation({
    mutationFn: blockFriend,
    onSuccess: invalidateFriendList,
  });

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
              onRemoveFriend={(friendId) =>
                removeFriendMutation.mutate(friendId)
              }
              onUnblockFriend={(friendId) =>
                removeFriendMutation.mutate(friendId)
              }
              onBlockFriend={(friendId) => blockFriendMutation.mutate(friendId)}
              onAcceptFriendRequest={(friendId) =>
                acceptFriendRequestMutation.mutate(friendId)
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
