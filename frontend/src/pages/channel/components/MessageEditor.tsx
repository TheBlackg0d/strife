import { useEffect, useRef, useState } from "react";
import { useUpdateMessageMutation } from "../../../services/message-api";
import { useAppDispatch } from "../../../store/hooks";
import type { Message } from "../types/channel";
import { setMessageIdInEditMode } from "../../../store/slices/message-slice";

interface MessageEditorProps {
  message: Message;
}

export default function MessageEditor({ message }: MessageEditorProps) {
  const dispatch = useAppDispatch();
  const [messageUpdateMutation] = useUpdateMessageMutation();

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
      messageUpdateMutation({
        messageId: message.id,
        payload: {
          media: message.media,
          content: inputRef.current.value,
          channelId: message.channelId,
        },
      });
      dispatch(setMessageIdInEditMode(null));
    }
  };

  const handleCancel = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      dispatch(setMessageIdInEditMode(null));
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
