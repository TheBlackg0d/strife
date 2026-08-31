import { useMemo, useState } from "react";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { DashBoard, Friend, FriendFilter } from "../../types/dashboard";
import { useLoaderData } from "react-router";

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
  const dashboardData = useLoaderData() as DashBoard;
  const [filter, setFilter] = useState<FriendFilter>("online");

  return (
    <>
      <FriendsHeader activeFilter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-y-auto p-4 md:px-8">
        <h2 className="mb-4 font-label text-xs font-bold text-outline">
          {sectionTitles[filter]} — {dashboardData.friends[filter]?.length}
        </h2>

        {dashboardData.friends[filter] &&
        dashboardData.friends[filter]?.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {dashboardData.friends[filter]?.map((friend) => (
              <FriendRow key={friend.id} friend={friend} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-outline">{emptyMessages[filter]}</p>
        )}
      </div>
    </>
  );
}

export default DashBoard;
