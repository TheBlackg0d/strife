import { FaDownload, FaFileAlt } from "react-icons/fa";
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "~/components/ui/attachment";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getFileQueryOptions } from "~/api/file/file.keys";
import { getMessagesQueryOptions } from "~/api/message/message.keys";
import type { MediaAttachment, Message } from "~/api/message/message.types";
import { useMessageRowEditMode } from "~/shared/store/useMessageRowEditMode";
import MessageActions from "./MessageActions";
import MessageEditor from "./MessageEditor";
import { stampFormatter, timeFormatter } from "~/lib/format";
import Avatar from "~/components/strife/Avatar";
import { stringToHslColor } from "~/lib/avatar";

interface MessageRowProps {
  message: Message;
  isGrouped: boolean;
}

const QUICK_REACTIONS = ["👍", "❤️", "😃", "😢", "🙏", "👎", "😡"];

async function downloadFile(blob: Blob, filename: string) {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

function getSimplifiedType(
  contentType: string,
): "Image" | "pdf" | "text" | "unknown" {
  const type = contentType.toLowerCase();

  if (type.startsWith("image/")) {
    return "Image";
  }
  if (type.includes("pdf")) {
    return "pdf";
  }
  if (
    type.startsWith("text/") ||
    type.includes("json") ||
    type.includes("xml")
  ) {
    return "text";
  }

  return "unknown";
}

function MessageRow({ message, isGrouped }: MessageRowProps) {
  const { content, media, sender, timestamp } = message;
  const sentAt = new Date(timestamp);

  const { messageIdInEditMode } = useMessageRowEditMode();

  const editMode: boolean = messageIdInEditMode === message.id;

  const handleReact = (emoji: string) => console.log(emoji);

  return (
    <li
      className={`group relative -mx-4 flex px-4 py-0.5 transition-colors hover:bg-surface-container-low/60 ${
        isGrouped ? "" : "mt-4"
      }`}
    >
      {isGrouped ? (
        <GroupedMessageRowHeader message={message} />
      ) : (
        <MessageRowHeader message={message} />
      )}
      <div className="min-w-0 flex-1">
        {!isGrouped && <MessageRowTitle message={message} />}

        {content && !editMode && <MessageRowContent message={message} />}

        {content && editMode && <MessageEditor message={message} />}

        <MessageRowMedia message={message} />
        <MessageRowReactions message={message} />
      </div>
      <MessageActions message={message} />
    </li>
  );
}

type MessageRowReactionsProps = Pick<MessageRowProps, "message">;

function MessageRowReactions({ message }: MessageRowReactionsProps) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {QUICK_REACTIONS.map((reaction) => (
        <ReactionPill
          key={reaction}
          emoji={reaction}
          count={1}
          onClick={() => console.log(reaction)}
        />
      ))}
    </div>
  );
}

type MessageRowContentProps = Pick<MessageRowProps, "message">;

function MessageRowContent({ message }: MessageRowContentProps) {
  return (
    <p className="text-[15px] leading-5.5 wrap-break-word whitespace-pre-wrap text-on-surface">
      {message.content}
    </p>
  );
}

type MessageRowMediaProps = Pick<MessageRowProps, "message">;

function MessageRowMedia({ message }: MessageRowMediaProps) {
  if (!message.media || message.media.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {message.media.map((item) => (
        <MessageAttachment
          key={item.fileId}
          media={item}
          channelId={message.channelId}
        />
      ))}
    </div>
  );
}

type MessageRowTitleProps = Pick<MessageRowProps, "message">;

function MessageRowTitle({ message }: MessageRowTitleProps) {
  const sentAt = new Date(message.timestamp);
  return (
    <div className="mb-0.5 flex items-baseline gap-2">
      <span className="cursor-pointer text-[16px] font-medium text-on-surface hover:underline">
        {message.sender.username}
      </span>
      <time
        dateTime={message.timestamp}
        className="text-xs text-outline-variant"
        title={sentAt.toLocaleString("fr-FR")}
      >
        {stampFormatter.format(sentAt)}
      </time>
    </div>
  );
}

type MessageRowHeaderProps = Pick<MessageRowProps, "message">;

function MessageRowHeader({ message }: MessageRowHeaderProps) {
  return (
    <Avatar
      name={message.sender.username}
      size={40}
      className="mt-0.5 mr-4 cursor-pointer"
      backgroundColor={stringToHslColor(message.sender.username)}
    />
  );
}

type GroupedMessageRowHeaderProps = Pick<MessageRowProps, "message">;

function GroupedMessageRowHeader({ message }: GroupedMessageRowHeaderProps) {
  const sentAt = new Date(message.timestamp);
  return (
    <time
      dateTime={sentAt.toISOString()}
      className="mt-1 mr-4 w-10 shrink-0 pr-4 text-right text-[10px] text-outline-variant opacity-0 group-hover:opacity-100"
    >
      {timeFormatter.format(sentAt)}
    </time>
  );
}

function ImageAttachment({
  media,
  handleError,
}: {
  media: MediaAttachment;
  handleError: (e: any) => void;
}) {
  return (
    <Attachment
      key={media.fileId}
      orientation="vertical"
      className="w-80 min-w-0 has-data-[slot=attachment-content]:w-80"
    >
      <AttachmentMedia variant={"image"}>
        <img
          className="object-cover"
          src={media.url}
          alt={media.originalName ?? "image"}
          onError={handleError}
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{media.originalName}</AttachmentTitle>
        <AttachmentDescription>
          {getSimplifiedType(media.contentType ?? "")}
        </AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}

function DocAttachment({ media }: { media: MediaAttachment }) {
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      const blob = await queryClient.fetchQuery(
        getFileQueryOptions(media.fileId),
      );
      downloadFile(blob, media.originalName ?? "file");
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <Attachment key={media.fileId}>
      <AttachmentMedia>
        <FaFileAlt />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{media.originalName}</AttachmentTitle>
        <AttachmentDescription>
          {getSimplifiedType(media.contentType ?? "")}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions onClick={handleDownload}>
        <FaDownload />
      </AttachmentActions>
    </Attachment>
  );
}

function MessageAttachment({
  media,
  channelId,
}: {
  media: MediaAttachment;
  channelId: string;
}) {
  const queryClient = useQueryClient();
  const hasRetried = useRef(false);
  const handleError = () => {
    if (hasRetried.current) return;
    hasRetried.current = true;
    queryClient.invalidateQueries({
      queryKey: getMessagesQueryOptions(channelId).queryKey,
    });
  };

  if (!media.contentType?.startsWith("image/")) {
    return <DocAttachment media={media} />;
  }

  return <ImageAttachment media={media} handleError={handleError} />;
}

function ReactionPill({
  emoji,
  count,
  reacted,
  onClick,
}: {
  emoji: string;
  count: number;
  reacted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[26px] cursor-pointer items-center gap-1.5 rounded-lg border px-2 transition-colors ${
        reacted
          ? "border-primary-container bg-primary-container/25 hover:bg-primary-container/35"
          : "border-primary-container/40 bg-primary-container/10 hover:border-primary-container hover:bg-primary-container/20"
      }`}
    >
      <span className="text-[15px] leading-none">{emoji}</span>
      <span
        className={`text-xs leading-none font-semibold tabular-nums ${
          reacted ? "text-primary" : "text-primary-fixed-dim"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default MessageRow;
