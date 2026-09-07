import { useState, type SubmitEvent } from "react";
import {
  MdAddCircle,
  MdCardGiftcard,
  MdGif,
  MdMood,
  MdStickyNote2,
} from "react-icons/md";
import IconButton from "../../../components/ui/IconButton";

interface MessageComposerProps {
  placeholderTarget: string;
  onSend: (content: string) => void;
}

function MessageComposer({
  placeholderTarget,
  onSend,
}: MessageComposerProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    onSend(content);
    setDraft("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 px-4 pt-2 pb-6 bg-surface"
    >
      <div className="flex min-h-11 items-center gap-3 rounded-lg bg-surface-bright px-4 py-2">
        <IconButton
          icon={MdAddCircle}
          label="Joindre un fichier"
          size={22}
        />

        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Envoyer un message à ${placeholderTarget}`}
          aria-label={`Envoyer un message à ${placeholderTarget}`}
          autoComplete="off"
          className="min-w-0 flex-1 border-none bg-transparent p-0 text-[15px] text-on-surface placeholder:text-outline-variant focus:ring-0 focus:outline-none"
        />

        <div className="flex shrink-0 items-center gap-1">
          <IconButton icon={MdCardGiftcard} label="Offrir un cadeau" size={22} />
          <IconButton icon={MdGif} label="Envoyer un GIF" size={22} />
          <IconButton icon={MdStickyNote2} label="Autocollants" size={22} />
          <IconButton icon={MdMood} label="Emoji" size={22} />
        </div>
      </div>
    </form>
  );
}

export default MessageComposer;
