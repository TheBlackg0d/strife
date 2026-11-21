import { MdKeyboardArrowDown } from "react-icons/md";
import { useGuild } from "~/api/guild/guild.hooks";
import type { Profile } from "~/api/profile/profile.types";
import UserPanel from "~/api/guild/UserPanel";
import ChannelCategory from "./ChannelCategory";
import GuildChannelItem from "./GuildChannelItem";

interface GuildSidebarProps {
  guildId: string;
  activeChannelId?: string;
  profile: Profile;
  onOpenSettings?: () => void;
}

function GuildSidebar({
  guildId,
  activeChannelId,
  profile,
  onOpenSettings,
}: GuildSidebarProps) {
  const { data: guild } = useGuild(guildId);

  const textChannels =
    guild?.channels.filter((channel) => channel.type !== "VOICE") ?? [];
  const voiceChannels =
    guild?.channels.filter((channel) => channel.type === "VOICE") ?? [];

  return (
    <aside className="flex h-full w-dm-sidebar shrink-0 flex-col bg-surface-container-low">
      <button
        type="button"
        className="flex h-12 shrink-0 cursor-pointer items-center justify-between gap-2 border-b border-surface-container-lowest/50 px-4 text-on-surface transition-colors hover:bg-surface-variant/40"
      >
        <span className="truncate text-[15px] font-bold">{guild?.name}</span>
        <MdKeyboardArrowDown size={20} className="shrink-0" />
      </button>

      <nav
        aria-label="Salons"
        className="flex flex-1 flex-col overflow-y-auto px-2 pb-2"
      >
        {textChannels.length > 0 && (
          <ChannelCategory title="SALONS TEXTUELS">
            {textChannels.map((channel) => (
              <GuildChannelItem
                key={channel.id}
                guildId={guildId}
                channel={channel}
                isActive={channel.id === activeChannelId}
              />
            ))}
          </ChannelCategory>
        )}

        {voiceChannels.length > 0 && (
          <ChannelCategory title="SALONS VOCAUX">
            {voiceChannels.map((channel) => (
              <GuildChannelItem
                key={channel.id}
                guildId={guildId}
                channel={channel}
              />
            ))}
          </ChannelCategory>
        )}
      </nav>

      <UserPanel profile={profile} onOpenSettings={onOpenSettings} />
    </aside>
  );
}

export default GuildSidebar;
