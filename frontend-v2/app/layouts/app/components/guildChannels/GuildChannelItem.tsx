import { Link } from "react-router";
import { MdTag, MdVolumeUp } from "react-icons/md";
import type { GuildChannel } from "~/api/guild/guild.types";

interface GuildChannelItemProps {
  guildId: string;
  channel: GuildChannel;
  isActive?: boolean;
}

const baseClassName =
  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[15px] font-medium transition-colors";

function GuildChannelItem({
  guildId,
  channel,
  isActive = false,
}: GuildChannelItemProps) {
  if (channel.type === "VOICE") {
    return (
      <button
        type="button"
        className={`${baseClassName} cursor-pointer text-outline hover:bg-surface-variant/50 hover:text-on-surface-variant`}
      >
        <MdVolumeUp size={20} className="shrink-0" />
        <span className="truncate">{channel.name}</span>
      </button>
    );
  }

  return (
    <Link
      to={`/guild/${guildId}/${channel.id}`}
      aria-current={isActive ? "page" : undefined}
      className={`${baseClassName} ${
        isActive
          ? "bg-surface-variant/70 text-on-surface"
          : "text-outline hover:bg-surface-variant/50 hover:text-on-surface-variant"
      }`}
    >
      <MdTag size={20} className="shrink-0" />
      <span className="truncate">{channel.name}</span>
    </Link>
  );
}

export default GuildChannelItem;
