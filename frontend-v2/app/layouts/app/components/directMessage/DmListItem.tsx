import Avatar from "~/components/strife/Avatar";
import type { Conversation } from "~/api/channel/channel.types";
import { stringToHslColor } from "~/lib/avatar";
import { Link } from "react-router";

interface DmListItemProps {
  conversation: Conversation;
  isActive?: boolean;
}

function DmListItem({ conversation, isActive = false }: DmListItemProps) {
  const { id, name, statusPreference, memberCount, imageUrl, icon } =
    conversation;
  const isOffline = statusPreference === "OFFLINE";

  return (
    <Link
      to={`/channel/${id}`}
      type="button"
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
    </Link>
  );
}

export default DmListItem;
