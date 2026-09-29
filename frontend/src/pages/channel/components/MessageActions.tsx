import { useRef, useState } from "react";
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import IconButton from "@/components/ui/strife/IconButton";
import EmojiPickerPopover from "@/components/ui/strife/EmojiPickerPopover";
import type { Message } from "../types/channel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProfileQuery } from "@/services/profile-api";
import { setMessageIdInEditMode } from "@/store/slices/message-slice";
import { useDeleteFileMutation } from "@/services/file-api";

const QUICK_REACTIONS = ["👍", "❤️", "😃", "😢", "🙏", "👎", "😡"];

interface MessageActionsProps {
  message: Message;
}

function MessageActions({ message }: MessageActionsProps) {
  const moreRef = useRef<HTMLButtonElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const [deleteMessage] = useDeleteFileMutation();

  const { data: profile } = useGetProfileQuery();

  const showPicker = message.sender.id === profile?.id;

  if (!showPicker) {
    return <></>;
  }

  const handleOnEdit = () => {
    dispatch(setMessageIdInEditMode(message.id));
    setIsPickerOpen(false);
  };

  const handleOnDelete = () => {
    deleteMessage(message.id);
    setIsPickerOpen(false);
  };

  const handleOnReact = (emoji: string) => {
    console.log(emoji);
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
