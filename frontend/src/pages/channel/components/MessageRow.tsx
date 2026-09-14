import { useRef, useState } from "react";
import Avatar from "../../../components/ui/Avatar";
import { strifeApi } from "../../../services/strife-api";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { stringToHslColor } from "../../../util/util";
import type { Message } from "../types/channel";
import MessageEditor from "./MessageEditor";
import MessageActions from "./MessageActions";
import { setMessageIdInEditMode } from "../../../store/slices/Message-slice";

const stampFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});
const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

interface MessageRowProps {
  message: Message;
  isGrouped: boolean;
}

function Attachment({ url }: { url: string }) {
  const dispatch = useAppDispatch();
  const hasRetried = useRef(false);

  const handleError = () => {
    if (hasRetried.current) return;
    hasRetried.current = true;
    dispatch(strifeApi.util.invalidateTags(["Messages"]));
  };

  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      onError={handleError}
      className="max-h-80 max-w-full rounded-lg object-contain"
    />
  );
}

function MessageRow({ message, isGrouped }: MessageRowProps) {
  const { content, media, sender, timestamp } = message;
  const sentAt = new Date(timestamp);

  const dispatch = useAppDispatch();

  const messageIdInEditMode = useAppSelector(
    (state) => state.message.messageIdInEditMode,
  );

  const editMode: boolean = messageIdInEditMode === message.id;

  const [editContent, setEditContent] = useState(content);

  const handleEdit = () => {};

  const handleReact = (emoji: string) => console.log(emoji);

  return (
    <li
      className={`group relative -mx-4 flex px-4 py-0.5 transition-colors hover:bg-surface-container-low/60 ${
        isGrouped ? "" : "mt-4"
      }`}
    >
      {isGrouped ? (
        <time
          dateTime={timestamp}
          className="mt-1 mr-4 w-10 shrink-0 pr-4 text-right text-[10px] text-outline-variant opacity-0 group-hover:opacity-100"
        >
          {timeFormatter.format(sentAt)}
        </time>
      ) : (
        <Avatar
          name={sender.username}
          size={40}
          className="mt-0.5 mr-4 cursor-pointer"
          backgroundColor={stringToHslColor(sender.username)}
        />
      )}

      <div className="min-w-0 flex-1">
        {!isGrouped && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <span className="cursor-pointer text-[16px] font-medium text-on-surface hover:underline">
              {sender.username}
            </span>
            <time
              dateTime={timestamp}
              className="text-xs text-outline-variant"
              title={sentAt.toLocaleString("fr-FR")}
            >
              {stampFormatter.format(sentAt)}
            </time>
          </div>
        )}

        {content && !editMode && (
          <p className="text-[15px] leading-5.5 wrap-break-word whitespace-pre-wrap text-on-surface">
            {content}
          </p>
        )}

        {content && editMode && (
          <MessageEditor
            content={content}
            onSubmit={handleEdit}
            onCancel={() => dispatch(setMessageIdInEditMode(null))}
          />
        )}

        {media && media.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {media.map((url) => (
              <Attachment key={url} url={url} />
            ))}
          </div>
        )}
      </div>
      <MessageActions
        onReact={handleReact}
        onEdit={() => dispatch(setMessageIdInEditMode(message.id))}
      />
    </li>
  );
}

export default MessageRow;
