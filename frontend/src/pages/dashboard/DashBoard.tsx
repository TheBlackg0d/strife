import { useMemo, useState } from "react";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import { friends } from "../../data/dashboard";
import type { FriendFilter } from "../../types/dashboard";

const sectionTitles: Record<FriendFilter, string> = {
  online: "EN LIGNE",
  all: "TOUS LES AMIS",
  pending: "EN ATTENTE",
  blocked: "BLOQUÉS",
};

const emptyMessages: Record<FriendFilter, string> = {
  online: "Personne n'est en ligne pour le moment.",
  all: "Vous n'avez pas encore d'amis.",
  pending: "Aucune demande en attente.",
  blocked: "Vous n'avez bloqué personne.",
};

/** Main stage of the home view: the friends list. */
function DashBoard() {
  const [filter, setFilter] = useState<FriendFilter>("online");

  const visibleFriends = useMemo(() => {
    switch (filter) {
      case "online":
        return friends.filter((friend) => friend.status !== "offline");
      case "all":
        return friends;
      // TODO: served by the friend-request endpoints once they exist.
      case "pending":
      case "blocked":
        return [];
    }
  }, [filter]);

  return (
    <>
      <FriendsHeader activeFilter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-y-auto p-4 md:px-8">
        <h2 className="mb-4 font-label text-xs font-bold text-outline">
          {sectionTitles[filter]} — {visibleFriends.length}
        </h2>

        {visibleFriends.length === 0 ? (
          <p className="text-sm text-outline">{emptyMessages[filter]}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleFriends.map((friend) => (
              <FriendRow key={friend.id} friend={friend} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default DashBoard;