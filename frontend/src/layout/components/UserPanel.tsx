import { MdHeadphones, MdMic, MdSettings } from "react-icons/md";
import Avatar from "../../components/ui/Avatar";
import IconButton from "../../components/ui/IconButton";
import type { PresenceStatus } from "../../types/profile";

interface UserPanelProps {
  username: string;
  status?: PresenceStatus;
  imageUrl?: string;
  onOpenSettings?: () => void;
  onToggleMic?: () => void;
  onToggleDeafen?: () => void;
}

const statusLabel: Record<PresenceStatus, string> = {
  ONLINE: "En ligne",
  INACTIVE: "Inactif",
  DO_NOT_DISTURB: "Ne pas déranger",
  OFFLINE: "Hors ligne",
  INVISIBLE: "Invisible",
};

/** Pinned to the bottom of the DM sidebar; never scrolls. */
function UserPanel({
  username,
  status = "ONLINE",
  imageUrl,
  onOpenSettings,
  onToggleMic,
  onToggleDeafen,
}: UserPanelProps) {
  return (
    <div className="flex h-13 shrink-0 items-center justify-between bg-surface-container-lowest/80 px-2">
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-sm px-1 py-1 hover:bg-surface-variant/50"
      >
        <Avatar
          name={username}
          imageUrl={imageUrl}
          status={status}
          size={32}
          ring="surface-container-lowest"
          surfaceClassName="bg-primary-container text-on-primary-container"
        />
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-semibold leading-tight text-on-surface">
            {username}
          </p>
          <p className="truncate text-[11px] leading-tight text-outline">
            {statusLabel[status]}
          </p>
        </div>
      </button>

      <div className="flex items-center">
        <IconButton icon={MdMic} label="Micro" onClick={onToggleMic} />
        <IconButton
          icon={MdHeadphones}
          label="Casque"
          onClick={onToggleDeafen}
        />
        <IconButton
          icon={MdSettings}
          label="Paramètres"
          onClick={onOpenSettings}
        />
      </div>
    </div>
  );
}

export default UserPanel;
