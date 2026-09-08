import { MdAdd, MdHome } from "react-icons/md";
import GuildItem from "./GuildItem";
import type { Guild } from "../../pages/dashboard/types/dashboard";

interface GuildRailProps {
  guilds: Guild[];
  activeGuildId?: string;
  onSelectGuild?: (guildId: string) => void;
  onSelectHome?: () => void;
  onCreateGuild?: () => void;
}

function GuildRail({
  guilds,
  activeGuildId,
  onSelectGuild,
  onSelectHome,
  onCreateGuild,
}: GuildRailProps) {
  return (
    <nav
      aria-label="Serveurs"
      className="flex h-full w-guild-rail shrink-0 flex-col items-center gap-2 overflow-y-auto bg-surface-container-lowest py-3"
    >
      <GuildItem
        name="Accueil"
        icon={MdHome}
        variant="brand"
        isActive={!activeGuildId}
        onClick={onSelectHome}
      />

      <span
        aria-hidden
        className="my-1 h-0.5 w-8 shrink-0 rounded-full bg-surface-variant"
      />

      {guilds.map((guild) => (
        <GuildItem
          key={guild.id}
          name={guild.name}
          imageUrl={guild.imageUrl}
          icon={guild.icon}
          isActive={guild.id === activeGuildId}
          onClick={() => onSelectGuild?.(guild.id)}
        />
      ))}

      <div className="mt-2">
        <GuildItem
          name="Ajouter un serveur"
          icon={MdAdd}
          variant="action"
          onClick={onCreateGuild}
        />
      </div>
    </nav>
  );
}

export default GuildRail;
