import { MdGroups } from "react-icons/md";
import type { FriendFilter } from "../../../types/dashboard";

const filters: { value: FriendFilter; label: string }[] = [
  { value: "online", label: "En ligne" },
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "blocked", label: "Bloqués" },
];

interface FriendsHeaderProps {
  activeFilter: FriendFilter;
  onFilterChange: (filter: FriendFilter) => void;
  onAddFriend?: () => void;
}

function FriendsHeader({
  activeFilter,
  onFilterChange,
  onAddFriend,
}: FriendsHeaderProps) {
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
              onClick={() => onFilterChange(value)}
              aria-current={value === activeFilter ? "true" : undefined}
              className={`cursor-pointer rounded-sm px-2 py-0.5 text-[15px] font-medium transition-colors ${
                value === activeFilter
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
        onClick={onAddFriend}
        className="cursor-pointer rounded-sm bg-primary-container px-2 py-1 text-[13px] font-medium text-on-primary-container transition-colors hover:bg-primary-container/90"
      >
        Ajouter un ami
      </button>
    </header>
  );
}

export default FriendsHeader;