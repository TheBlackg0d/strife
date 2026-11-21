import {
  MdHelp,
  MdNotifications,
  MdPeopleAlt,
  MdPushPin,
  MdSearch,
  MdTag,
} from "react-icons/md";
import IconButton from "~/components/strife/IconButton";

interface GuildChannelHeaderProps {
  channelName: string;
  guildName: string;
  isMemberListOpen: boolean;
  onToggleMemberList?: () => void;
}

export default function GuildChannelHeader({
  channelName,
  guildName,
  isMemberListOpen,
  onToggleMemberList,
}: GuildChannelHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-surface-container-lowest/30 px-4">
      <h1 className="flex min-w-0 shrink-0 items-center gap-1.5 text-[15px] font-bold text-on-surface">
        <MdTag size={24} className="shrink-0 text-outline" />
        <span className="truncate">{channelName}</span>
      </h1>

      <span aria-hidden className="h-6 w-px shrink-0 bg-outline-variant" />

      <p className="min-w-0 truncate text-[13px] text-on-surface-variant">
        Bienvenue sur {guildName}
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <IconButton icon={MdPushPin} label="Messages épinglés" size={20} />
        <IconButton
          icon={MdNotifications}
          label="Paramètres de notification"
          size={20}
        />

        <button
          type="button"
          onClick={onToggleMemberList}
          aria-pressed={isMemberListOpen}
          aria-label="Afficher ou masquer la liste des membres"
          title="Liste des membres"
          className={`flex cursor-pointer items-center justify-center rounded-sm p-1 transition-colors ${
            isMemberListOpen
              ? "bg-surface-variant text-on-surface"
              : "text-outline hover:bg-surface-variant hover:text-on-surface"
          }`}
        >
          <MdPeopleAlt size={20} />
        </button>

        <div className="ml-2 flex h-6 items-center rounded-sm bg-surface-container-lowest px-1.5">
          <input
            type="search"
            placeholder="Rechercher"
            aria-label={`Rechercher dans ${guildName}`}
            className="w-30 border-none bg-transparent p-0 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:outline-none"
          />
          <MdSearch size={16} className="text-outline" />
        </div>

        <IconButton icon={MdHelp} label="Aide" size={20} />
      </div>
    </header>
  );
}
