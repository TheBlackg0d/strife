import { useRef, useState } from "react";
import { MdAdd, MdModeEdit } from "react-icons/md";
import IconButton from "../../../components/ui/IconButton";
import EmojiPickerPopover from "../../../components/ui/EmojiPickerPopover";

const QUICK_REACTIONS = ["👍", "❤️", "😃", "😢", "🙏", "👎", "😡"];

interface MessageActionsProps {
  onReact: (emoji: string) => void;
  onEdit: () => void;
  showPicker: boolean;
}

function MessageActions({ onReact, onEdit, showPicker }: MessageActionsProps) {
  const moreRef = useRef<HTMLButtonElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (!showPicker) {
    return <></>;
  }

  const handleOnEdit = () => {
    onEdit();
    setIsPickerOpen(false);
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
          onClick={() => onReact(emoji)}
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

      <EmojiPickerPopover
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        anchorRef={moreRef}
        onSelect={onReact}
      />
    </div>
  );
}

export default MessageActions;
