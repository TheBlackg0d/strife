import Avatar from "../../components/ui/Avatar";
import type { Conversation } from "../../pages/dashboard/types/dashboard";
import { stringToHslColor } from "../../util/util";

interface DmListItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect?: (conversationId: string) => void;
}

function DmListItem({
  conversation,
  isActive = false,
  onSelect,
}: DmListItemProps) {
  const { id, name, statusPreference, memberCount, imageUrl, icon } =
    conversation;
  const isOffline = statusPreference === "OFFLINE";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      aria-current={isActive ? "page" : undefined}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 transition-colors ${
        isActive
          ? "bg-surface-variant/70 text-on-surface"
          : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
      }`}
    >
      <Avatar
        name={name}
        imageUrl={imageUrl}
        icon={icon}
        status={statusPreference}
        ring={isActive ? "surface-variant" : "surface-container-low"}
        className={isOffline ? "opacity-60" : undefined}
        backgroundColor={stringToHslColor(name)}
      />

      <div
        className={`min-w-0 flex-1 text-left ${isOffline ? "opacity-60" : ""}`}
      >
        <p className="truncate text-[15px] font-medium">{name}</p>
        {memberCount !== undefined && (
          <p className="truncate text-xs text-outline">{memberCount} membres</p>
        )}
      </div>
    </button>
  );
}

export default DmListItem;
