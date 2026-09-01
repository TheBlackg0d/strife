import { MdChatBubble, MdCheck, MdClose, MdMoreVert } from "react-icons/md";
import Avatar from "../../../components/ui/Avatar";
import IconButton from "../../../components/ui/IconButton";
import FriendActivity from "./FriendActivity";
import type { Friend } from "../types/dashboard";

interface FriendRowProps {
  friend: Friend;
  onMessage?: (friendId: string) => void;
  onOpenMenu?: (friendId: string) => void;
  onAddFriend?: (friendId: String) => void;
  onDeclineFriend?: (friendId: String) => void;
  isInFriendRequestArea?: boolean;
}

function FriendRow({
  friend,
  onMessage,
  onOpenMenu,
  onAddFriend,
  onDeclineFriend,
  isInFriendRequestArea,
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

      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {isInFriendRequestArea && (
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <IconButton
              icon={MdCheck}
              label={`Ajouter ${username} à vos amis`}
              variant="raised"
              size={20}
              onClick={() => onAddFriend?.(id)}
            />
            <IconButton
              icon={MdClose}
              label={`Refuser la demande de ${username}`}
              variant="raised"
              size={20}
              onClick={() => onDeclineFriend?.(id)}
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
          icon={MdMoreVert}
          label={`Plus d'options pour ${username}`}
          variant="raised"
          size={20}
          onClick={() => onOpenMenu?.(id)}
        />
      </div>
    </li>
  );
}

export default FriendRow;
