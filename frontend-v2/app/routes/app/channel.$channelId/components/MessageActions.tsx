import { useRef, useState } from "react";
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import {
  useDeleteMessage,
  useToggleReaction,
} from "~/api/message/message.hooks";
import type { Message } from "~/api/message/message.types";
import { useProfileQuery } from "~/api/profile/profile.hooks";
import { useMessageRowEditMode } from "~/shared/store/useMessageRowEditMode";
import EmojiPickerPopover from "~/components/strife/EmojiPickerPopover";
import IconButton from "~/components/strife/IconButton";

const QUICK_REACTIONS = ["👍", "❤️", "😃", "😢", "🙏", "👎", "😡"];

interface MessageActionsProps {
  message: Message;
}

function MessageActions({ message }: MessageActionsProps) {
  const moreRef = useRef<HTMLButtonElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const setMessageIdInEditMode = useMessageRowEditMode(
    (state) => state.setMessageIdInEditMode,
  );
  const deleteMessage = useDeleteMessage();
  const toggleReaction = useToggleReaction();
  const { data: profile } = useProfileQuery();

  const isOwner = message.sender.id === profile?.id;

  const handleOnEdit = () => {
    setMessageIdInEditMode(message.id);
    setIsPickerOpen(false);
  };

  const handleOnDelete = () => {
    deleteMessage.mutate({
      messageId: message.id,
      channelId: message.channelId,
    });
    setIsPickerOpen(false);
  };

  const handleOnReact = (emoji: string) => {
    toggleReaction.mutate({
      messageId: message.id,
      channelId: message.channelId,
      emoji,
    });
  };

  return (
    <div
      className={`absolute -top-4 right-4 z-10 flex items-center gap-1 rounded-lg border border-surface-container bg-surface-container-high p-1 shadow-md shadow-black/30 ${
        isPickerOpen ? "" : "opacity-0 group-hover:opacity-100"
      } hover:opacity-100`}
    >
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleOnReact(emoji)}
          aria-label={`Réagir avec ${emoji}`}
          title={emoji}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-[18px] leading-none transition-colors hover:bg-surface-variant"
        >
          {emoji}
        </button>
      ))}

      <IconButton
        ref={moreRef}
        icon={MdAdd}
        label="Plus d'émojis"
        size={18}
        hasPopup
        isExpanded={isPickerOpen}
        onClick={() => setIsPickerOpen((open) => !open)}
      />

      {isOwner && (
        <>
          <span aria-hidden className="mx-0.5 h-5 w-px bg-surface-variant" />

          <IconButton
            icon={MdModeEdit}
            label="Modifier le message"
            size={18}
            onClick={handleOnEdit}
          />

          <IconButton
            icon={MdDelete}
            label="Supprimer le message"
            size={18}
            onClick={handleOnDelete}
          />
        </>
      )}

      <EmojiPickerPopover
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        anchorRef={moreRef}
        onSelect={(emoji) => handleOnReact(emoji)}
      />
    </div>
  );
}

export default MessageActions;
