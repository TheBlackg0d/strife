import { useRef, useState } from "react";

import {
  MdBlock,
  MdChatBubble,
  MdCheck,
  MdClose,
  MdMoreVert,
  MdPersonRemove,
} from "react-icons/md";
import type { Friend, FriendFilter } from "~/api/friend/friend.types";
import type { DropdownMenuItem } from "~/components/strife/DropdownMenu";
import Avatar from "~/components/strife/Avatar";
import IconButton from "~/components/strife/IconButton";
import {
  useAcceptFriendRequest,
  useBlockFriend,
  useRemoveFriend,
} from "~/api/friend/friend.hooks";
import DropdownMenu from "~/components/strife/DropdownMenu";
import { useChannel, useChannelByFriendId } from "~/api/channel/channel.hooks";

interface FriendRowProps {
  friend: Friend;
  friendFilter: FriendFilter;
}

function FriendRow({ friend, friendFilter }: FriendRowProps) {
  const { id, username, tag, statusPreference, imageUrl, icon, isBot } = friend;

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
        </div>
      </div>
      <FriendRowActionOptions friend={friend} friendFilter={friendFilter} />
    </li>
  );
}

type FriendRowActionOptionsProps = Pick<
  FriendRowProps,
  "friend" | "friendFilter"
>;

function FriendRowActionOptions({
  friend,
  friendFilter,
}: FriendRowActionOptionsProps) {
  const { id, username } = friend;

  const acceptFriendRequestMutation = useAcceptFriendRequest();
  const removeFriendMutation = useRemoveFriend();
  const blockFriendMutation = useBlockFriend();
  const { fetchChannelByFriendId } = useChannelByFriendId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isInFriendRequestArea =
    friendFilter === "PENDING_FRIEND_REQUEST_RECEIVED";

  const openDm = (id: string) => {
    fetchChannelByFriendId(id);
  };

  const isBlocked = friendFilter === "BLOCKED";
  const menuItems: DropdownMenuItem[] = [
    isBlocked
      ? {
          id: "unblock",
          label: "Débloquer",
          icon: MdBlock,
          tone: "danger",
          onSelect: () => removeFriendMutation.mutate(id),
        }
      : {
          id: "block",
          label: "Bloquer",
          icon: MdBlock,
          tone: "danger",
          onSelect: () => blockFriendMutation.mutate(id),
        },
  ];

  if (!isBlocked) {
    menuItems.push({
      id: "remove",
      label: "Retirer l'ami",
      icon: MdPersonRemove,
      tone: "danger",
      onSelect: () => removeFriendMutation.mutate(id),
    });
  }
  return (
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
            onClick={() => acceptFriendRequestMutation.mutate(id)}
          />
          <IconButton
            icon={MdClose}
            label={`Refuser la demande de ${username}`}
            variant="raised"
            size={20}
            onClick={() => removeFriendMutation.mutate(id)}
          />
        </div>
      )}
      <IconButton
        icon={MdChatBubble}
        label={`Envoyer un message à ${username}`}
        variant="raised"
        size={20}
        onClick={() => openDm(id)}
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
  );
}

export default FriendRow;
