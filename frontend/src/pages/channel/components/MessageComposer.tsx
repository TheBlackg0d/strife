import {
  MdAddCircle,
  MdCardGiftcard,
  MdGif,
  MdMood,
  MdStickyNote2,
} from "react-icons/md";
import IconButton from "@/components/ui/strife/IconButton";
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import { type SubmitEvent } from "react";
import type { Channel } from "@/pages/channel/types/channel";
import { useMessageDraft } from "@/pages/channel/hook/useMessageDraft";
import { useMessageAttachments } from "@/pages/channel/hook/useMessageAttachments";
import { useSendMessage } from "@/pages/channel/hook/useSendMessage";

interface MessageComposerProps {
  placeholderTarget: string;
  channel: Channel;
}

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

function MessageComposer({ placeholderTarget, channel }: MessageComposerProps) {
  const { draft, setDraft, clearDraft } = useMessageDraft();
  const {
    pondRef,
    hasAttachments,
    media,
    setFiles,
    openFileExplorer,
    handleAddFile,
    handleRemoveFile,
    clearAttachments,
  } = useMessageAttachments(channel.id);
  const { sendMessage } = useSendMessage(channel.id);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content && !hasAttachments) return;

    sendMessage(content, media);
    clearDraft();
    clearAttachments();
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
            onaddfile={(_error, file) => {
              handleAddFile(file);
            }}
            onremovefile={(_error, file) => {
              handleRemoveFile(file);
            }}
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
            onClick={openFileExplorer}
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
