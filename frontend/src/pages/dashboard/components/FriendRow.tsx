import { useRef, useState } from "react";
import {
  MdBlock,
  MdChatBubble,
  MdCheck,
  MdClose,
  MdMoreVert,
  MdPersonRemove,
} from "react-icons/md";
import Avatar from "../../../components/ui/Avatar";
import DropdownMenu, {
  type DropdownMenuItem,
} from "../../../components/ui/DropdownMenu";
import IconButton from "../../../components/ui/IconButton";
import FriendActivity from "./FriendActivity";
import type { Friend } from "../types/dashboard";

interface FriendRowProps {
  friend: Friend;
  onMessage?: (friendId: string) => void;
  onAcceptFriendRequest?: (friendId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
  onBlockFriend?: (friendId: string) => void;
  onUnblockFriend?: (friendId: string) => void;
  isInFriendRequestArea?: boolean;
  isBlocked?: boolean;
}

function FriendRow({
  friend,
  onMessage,
  onAcceptFriendRequest,
  onRemoveFriend,
  onBlockFriend,
  onUnblockFriend,
  isInFriendRequestArea,
  isBlocked,
}: FriendRowProps) {
  const {
    id,
    username,
    tag,
    statusPreference,
    activity,
    imageUrl,
    icon,
    isBot,
  } = friend;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuItems: DropdownMenuItem[] = [
    isBlocked
      ? {
          id: "unblock",
          label: "Débloquer",
          icon: MdBlock,
          tone: "danger",
          onSelect: () => onUnblockFriend?.(id),
        }
      : {
          id: "block",
          label: "Bloquer",
          icon: MdBlock,
          tone: "danger",
          onSelect: () => onBlockFriend?.(id),
        },
  ];

  if (!isBlocked) {
    menuItems.push({
      id: "remove",
      label: "Retirer l'ami",
      icon: MdPersonRemove,
      tone: "danger",
      onSelect: () => onRemoveFriend?.(id),
    });
  }

  return (
    <li className="group flex cursor-pointer items-center justify-between rounded-lg border-t border-surface-container/50 p-3 transition-colors hover:bg-surface-container-low">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          name={username}
          imageUrl={imageUrl}
          icon={icon}
          status={statusPreference}
          size={40}
          ring="surface"
          className={statusPreference === "OFFLINE" ? "opacity-80" : undefined}
        />

        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[15px] font-semibold text-on-surface">
            <span className="truncate">{username}</span>
            {tag && (
              <span className="hidden text-xs font-normal text-outline group-hover:inline">
                {tag}
              </span>
            )}
            {isBot && (
              <span className="flex items-center gap-0.5 rounded-sm bg-primary-container px-1 text-[10px] font-bold uppercase text-on-primary-container">
                <MdCheck size={10} />
                Bot
              </span>
            )}
          </p>
          {activity && <FriendActivity activity={activity} />}
        </div>
      </div>

      <div
        className={`flex items-center gap-2 transition-opacity group-hover:opacity-100 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {isInFriendRequestArea && (
          <div className="flex items-center gap-2">
            <IconButton
              icon={MdCheck}
              label={`Ajouter ${username} à vos amis`}
              variant="raised"
              size={20}
              onClick={() => onAcceptFriendRequest?.(id)}
            />
            <IconButton
              icon={MdClose}
              label={`Refuser la demande de ${username}`}
              variant="raised"
              size={20}
              onClick={() => onRemoveFriend?.(id)}
            />
          </div>
        )}
        <IconButton
          icon={MdChatBubble}
          label={`Envoyer un message à ${username}`}
          variant="raised"
          size={20}
          onClick={() => onMessage?.(id)}
        />
        <IconButton
          ref={menuButtonRef}
          icon={MdMoreVert}
          label={`Plus d'options pour ${username}`}
          variant="raised"
          size={20}
          hasPopup
          isExpanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        />
        <DropdownMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          anchorRef={menuButtonRef}
          items={menuItems}
          label={`Options pour ${username}`}
        />
      </div>
    </li>
  );
}

export default FriendRow;
