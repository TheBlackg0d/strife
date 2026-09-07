import {
  MdAlternateEmail,
  MdCall,
  MdGroups,
  MdHelp,
  MdPeopleAlt,
  MdPersonAdd,
  MdPushPin,
  MdSearch,
  MdVideocam,
} from "react-icons/md";
import IconButton from "../../../components/ui/IconButton";

interface ChannelHeaderProps {
  title: string;
  isGroup: boolean;
  memberCount: number;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
  onAddMembers?: () => void;
}

function ChannelHeader({
  title,
  isGroup,
  memberCount,
  isSidePanelOpen,
  onToggleSidePanel,
  onAddMembers,
}: ChannelHeaderProps) {
  const TitleIcon = isGroup ? MdGroups : MdAlternateEmail;

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-surface-container-lowest/30 px-4">
      <h1 className="flex min-w-0 items-center gap-2 text-[15px] font-bold text-on-surface">
        <TitleIcon size={24} className="shrink-0 text-outline" />
        <span className="truncate">{title}</span>
      </h1>

      {isGroup && (
        <span className="shrink-0 text-[13px] text-outline">
          {memberCount} membres
        </span>
      )}

      <div className="ml-auto flex items-center gap-1">
        <IconButton icon={MdCall} label="Démarrer un appel vocal" size={20} />
        <IconButton
          icon={MdVideocam}
          label="Démarrer un appel vidéo"
          size={20}
        />
        <IconButton icon={MdPushPin} label="Messages épinglés" size={20} />
        <IconButton
          icon={MdPersonAdd}
          label="Ajouter des membres"
          size={20}
          onClick={onAddMembers}
        />

        <button
          type="button"
          onClick={onToggleSidePanel}
          aria-pressed={isSidePanelOpen}
          aria-label={
            isGroup
              ? "Afficher ou masquer la liste des membres"
              : "Afficher ou masquer le profil"
          }
          title={isGroup ? "Liste des membres" : "Profil utilisateur"}
          className={`flex cursor-pointer items-center justify-center rounded-sm p-1 transition-colors ${
            isSidePanelOpen
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
            aria-label="Rechercher dans la conversation"
            className="w-30 border-none bg-transparent p-0 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:outline-none"
          />
          <MdSearch size={16} className="text-outline" />
        </div>

        <IconButton icon={MdHelp} label="Aide" size={20} />
      </div>
    </header>
  );
}

export default ChannelHeader;
