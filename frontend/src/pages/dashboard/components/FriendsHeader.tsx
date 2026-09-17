import { MdGroups } from "react-icons/md";
import type { DashboardTab, FriendFilter } from "@/pages/dashboard/types/dashboard";
import { filters } from "@/pages/dashboard/DashBoard";
import Badge from "@/components/ui/strife/Badge";
import IconButton from "@/components/ui/strife/IconButton";
import type { IconBaseProps } from "react-icons";
import { TbMessage2Plus } from "react-icons/tb";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import CreateGroupChannelModal from "./CreateGroupChannelModal";
import { useState } from "react";

interface FriendsHeaderProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

function FriendsHeader({ activeTab, onTabChange }: FriendsHeaderProps) {
  const isAddingFriend = activeTab === "ADD_FRIEND";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-surface-container-lowest/30 px-4">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="flex items-center gap-2 text-[15px] font-bold text-on-surface">
          <MdGroups size={24} />
          Amis
        </h1>

        <span aria-hidden className="mx-2 h-6 w-px bg-surface-variant" />

        <nav aria-label="Filtrer les amis" className="flex items-center gap-4">
          {filters.map(({ value, label, count }) => (
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
              <div className="flex gap-1 justify-center items-center">
                {label}
                {count && count !== 0 && <Badge count={count} />}
              </div>
            </button>
          ))}
        </nav>
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
      </div>
      <IconButton
        icon={BiSolidMessageRoundedAdd}
        label={"Creer un groupe"}
        size={36}
        onClick={() => setIsOpen(true)}
      />
      <CreateGroupChannelModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
}

export default FriendsHeader;
