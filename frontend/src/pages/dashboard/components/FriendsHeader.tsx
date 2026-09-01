import { MdGroups } from "react-icons/md";
import type { DashboardTab, FriendFilter } from "../types/dashboard";

const filters: { value: FriendFilter; label: string }[] = [
  { value: "ONLINE", label: "En ligne" },
  { value: "ALL", label: "Tous" },
  { value: "PENDING_FRIEND_REQUEST_RECEIVED", label: "En attente" },
  { value: "PENDING_FRIEND_REQUEST_SENT", label: "Envoyées" },
  { value: "BLOCKED", label: "Bloqués" },
];

interface FriendsHeaderProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

function FriendsHeader({ activeTab, onTabChange }: FriendsHeaderProps) {
  const isAddingFriend = activeTab === "ADD_FRIEND";
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-surface-container-lowest/30 px-4">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="flex items-center gap-2 text-[15px] font-bold text-on-surface">
          <MdGroups size={24} />
          Amis
        </h1>

        <span aria-hidden className="mx-2 h-6 w-px bg-surface-variant" />

        <nav aria-label="Filtrer les amis" className="flex items-center gap-4">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onTabChange(value)}
              aria-current={value === activeTab ? "true" : undefined}
              className={`cursor-pointer rounded-sm px-2 py-0.5 text-[15px] font-medium transition-colors ${
                value === activeTab
                  ? "bg-surface-variant text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => onTabChange(isAddingFriend ? "ONLINE" : "ADD_FRIEND")}
        aria-current={isAddingFriend ? "true" : undefined}
        className={`cursor-pointer rounded-sm px-2 py-1 text-[13px] font-medium transition-colors ${
          isAddingFriend
            ? "bg-transparent text-secondary hover:bg-surface-variant/50"
            : "bg-primary-container text-on-primary-container hover:bg-primary-container/90"
        }`}
      >
        Ajouter un ami
      </button>
    </header>
  );
}

export default FriendsHeader;
