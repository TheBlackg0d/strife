import { Fragment, useEffect, useRef } from "react";
import ChannelIntro from "./ChannelIntro";
import MessageRow from "./MessageRow";
import type { Message, PrivateChannel } from "../types/channel";

/** Messages closer than this to the previous one from the same author merge. */
const GROUPING_WINDOW_MS = 5 * 60 * 1000;

const dayFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface MessageListProps {
  channel: PrivateChannel;
  title: string;
  isGroup: boolean;
  messages: Message[];
  onAddMembers?: () => void;
}

function MessageList({
  channel,
  title,
  isGroup,
  messages,
  onAddMembers,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // The feed is pinned to the newest message, like every chat client.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [channel.id, messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <ChannelIntro
        channel={channel}
        isGroup={isGroup}
        title={title}
        onAddMembers={onAddMembers}
      />

      <ul className="flex flex-col pb-4">
        {messages.map((message, index) => {
          const previous = index > 0 ? messages[index - 1] : undefined;
          const sentAt = new Date(message.timestamp);
          const previousSentAt = previous
            ? new Date(previous.timestamp)
            : undefined;

          const startsNewDay =
            !previousSentAt ||
            previousSentAt.toDateString() !== sentAt.toDateString();

          const isGrouped =
            !startsNewDay &&
            previous?.sender.userId === message.sender.userId &&
            sentAt.getTime() - (previousSentAt?.getTime() ?? 0) <
              GROUPING_WINDOW_MS;

          return (
            <Fragment key={message.id}>
              {startsNewDay && (
                <li
                  role="separator"
                  className="relative my-4 flex items-center justify-center"
                >
                  <span
                    aria-hidden
                    className="absolute h-px w-full bg-surface-variant"
                  />
                  <span className="relative bg-surface px-2 text-xs font-semibold text-outline-variant">
                    {dayFormatter.format(sentAt)}
                  </span>
                </li>
              )}
              <MessageRow message={message} isGrouped={isGrouped} />
            </Fragment>
          );
        })}
      </ul>

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
