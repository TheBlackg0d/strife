import { useEffect, useRef, useState } from "react";
import { useUpdateMessage } from "~/api/message/message.hooks";
import type { Message } from "~/api/message/message.types";
import { useMessageRowEditMode } from "~/shared/store/useMessageRowEditMode";

interface MessageEditorProps {
  message: Message;
}

export default function MessageEditor({ message }: MessageEditorProps) {
  const setMessageIdInEditMode = useMessageRowEditMode(
    (state) => state.setMessageIdInEditMode,
  );
  const { mutate: updateMessage } = useUpdateMessage();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.addEventListener("keydown", handleCancel);
    window.addEventListener("keydown", handleEdit);

    return () => {
      window.removeEventListener("keydown", handleCancel);
      window.removeEventListener("keydown", handleEdit);
    };
  }, []);

  const handleEdit = (e: KeyboardEvent) => {
    if (e.key == "Enter" && inputRef.current?.value) {
      updateMessage({
        messageId: message.id,
        payload: {
          media:
            message.media?.map(({ fileId, contentType, originalName }) => ({
              fileId,
              contentType,
              originalName,
            })) ?? null,
          content: inputRef.current.value,
          channelId: message.channelId,
        },
      });
      setMessageIdInEditMode(null);
    }
  };

  const handleCancel = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      setMessageIdInEditMode(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        defaultValue={message.content}
        type="text"
        className="text-gray-100 bg-neutral-700 placeholder:text-gray-500 focus:ring-2 focus:outline-none rounded-sm h-9 p-2"
      />
      <div className="flex justify-start gap-2 text-sm">
        <span>
          Press <span className="text-blue-500">Enter</span> to send
        </span>
        -
        <span>
          Press <span className="text-blue-500">Escape</span> to cancel
        </span>
      </div>
    </div>
  );
}
