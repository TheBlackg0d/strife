import { useRef, useState, type SubmitEvent } from "react";
import {
  MdAddCircle,
  MdCardGiftcard,
  MdGif,
  MdMood,
  MdStickyNote2,
} from "react-icons/md";
import IconButton from "../../../components/ui/IconButton";
import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondFile } from "filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

interface MessageComposerProps {
  placeholderTarget: string;
  onSend: (content: string, files: File[]) => void;
}

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

function MessageComposer({ placeholderTarget, onSend }: MessageComposerProps) {
  const [draft, setDraft] = useState("");

  const pondRef = useRef<FilePond>(null);
  const [files, setFiles] = useState<FilePondFile[]>([]);

  const hasAttachments = files.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content && !hasAttachments) return;

    onSend(
      content,
      files.map((item) => item.file as File),
    );
    setDraft("");
    pondRef.current?.removeFiles();
  };

  const handleFileUpload = () => {
    pondRef.current?.browse();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 px-4 pt-2 pb-6 bg-surface"
    >
      <div className="rounded-lg bg-surface-bright">
        <div
          className={
            hasAttachments
              ? "border-b border-surface-variant px-4 pt-3 pb-1 [&_.filepond--credits]:hidden! [&_.filepond--drop-label]:hidden! [&_.filepond--file-status]:hidden! [&_.filepond--item]:w-48 [&_.filepond--panel-root]:border-none! [&_.filepond--panel-root]:bg-surface-variant! [&_.filepond--root]:mb-0! [&_.filepond--root]:min-h-0!"
              : "pointer-events-none h-0 overflow-hidden opacity-0"
          }
        >
          <FilePond
            ref={pondRef}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={3}
            name="files"
            credits={false}
            instantUpload={false}
            allowImagePreview={true}
            styleItemPanelAspectRatio="1"
            labelIdle=""
          />
        </div>

        <div className="flex min-h-11 items-center gap-3 px-4 py-2">
          <IconButton
            icon={MdAddCircle}
            label="Joindre un fichier"
            size={22}
            onClick={handleFileUpload}
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
            <IconButton
              icon={MdCardGiftcard}
              label="Offrir un cadeau"
              size={22}
            />
            <IconButton icon={MdGif} label="Envoyer un GIF" size={22} />
            <IconButton icon={MdStickyNote2} label="Autocollants" size={22} />
            <IconButton icon={MdMood} label="Emoji" size={22} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default MessageComposer;
