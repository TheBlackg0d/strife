import { useState } from "react";
import FriendRow from "./components/FriendRow";
import FriendsHeader from "./components/FriendsHeader";
import type { IDashBoard, FriendFilter } from "../../types/dashboard";
import { useLoaderData } from "react-router";

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
  const dashboardData = useLoaderData() as IDashBoard;
  const [filter, setFilter] = useState<FriendFilter>("ACCEPTED");

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
