import { useState } from "react";
import AddFriendForm from "./components/AddFriendForm";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { DashboardTab, Friend, FriendFilter } from "./types/dashboard";
import { useQuery } from "@tanstack/react-query";
import createFriendListQueryOptions from "./types/friend-list-query-option";

const sectionTitles: Record<FriendFilter, string> = {
  ACCEPTED: "EN LIGNE",
  ALL: "TOUS LES AMIS",
  PENDING: "EN ATTENTE",
  BLOCKED: "BLOQUÉS",
};

const emptyMessages: Record<FriendFilter, string> = {
  ACCEPTED: "Personne n'est en ligne pour le moment.",
  ALL: "Vous n'avez pas encore d'amis.",
  PENDING: "Aucune demande en attente.",
  BLOCKED: "Vous n'avez bloqué personne.",
};

function DashBoard() {
  const { data: friends } = useQuery(createFriendListQueryOptions());

  console.log(friends);
  const [tab, setTab] = useState<DashboardTab>("ACCEPTED");

  return (
    <>
      <FriendsHeader activeTab={tab} onTabChange={setTab} />

      {tab === "ADD_FRIEND" ? (
        <AddFriendForm />
      ) : (
        <FriendList filter={tab} friends={friends?.[tab] ?? undefined} />
      )}
    </>
  );
}

interface FriendListProps {
  filter: FriendFilter;
  friends?: Friend[];
}

function FriendList({ filter, friends }: FriendListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8">
      <h2 className="mb-4 font-label text-xs font-bold text-outline">
        {sectionTitles[filter]} — {friends?.length}
      </h2>

      {friends && friends.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {friends.map((friend) => (
            <FriendRow
              key={friend.id}
              friend={friend}
              isInFriendRequestArea={filter === "PENDING"}
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
