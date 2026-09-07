import { useState } from "react";
import AddMembersModal from "./AddMembersModal";
import ChannelHeader from "./ChannelHeader";
import MemberListPanel from "./MemberListPanel";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import UserProfilePanel from "./UserProfilePanel";
import { currentUserId } from "../../../data/channels";
import {
  isGroupChannel,
  otherMember,
  type Member,
  type Message,
  type PrivateChannel,
} from "../types/channel";

interface PrivateChannelViewProps {
  initialChannel: PrivateChannel;
  initialMessages: Message[];
}

/**
 * Mounted with the channel id as `key`, so switching conversations gives it a
 * fresh draft, roster and message list. Both stay local until the messaging
 * endpoints are wired to the frontend.
 */
function PrivateChannelView({
  initialChannel,
  initialMessages,
}: PrivateChannelViewProps) {
  const [channel, setChannel] = useState(initialChannel);
  const [messages, setMessages] = useState(initialMessages);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  const isGroup = isGroupChannel(channel);
  const peer = otherMember(channel, currentUserId);
  const title = isGroup
    ? channel.channelName
    : (peer?.username ?? channel.channelName);

  const handleSend = (content: string) => {
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        content,
        sender: { userId: currentUserId, username: "UserOne" },
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleAddMembers = (invited: Member[]) => {
    setChannel((previous) => ({
      ...previous,
      member: [...previous.member, ...invited],
    }));
  };

  return (
    <>
      <ChannelHeader
        title={title}
        isGroup={isGroup}
        memberCount={channel.member.length}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen((open) => !open)}
        onAddMembers={() => setIsAddMembersOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <MessageList
            channel={channel}
            title={title}
            isGroup={isGroup}
            messages={messages}
            onAddMembers={() => setIsAddMembersOpen(true)}
          />
          <MessageComposer
            placeholderTarget={isGroup ? title : `@${title}`}
            onSend={handleSend}
          />
        </div>

        {isSidePanelOpen &&
          (isGroup ? (
            <MemberListPanel
              members={channel.member}
              currentUserId={currentUserId}
              onAddMembers={() => setIsAddMembersOpen(true)}
            />
          ) : (
            peer && <UserProfilePanel member={peer} />
          ))}
      </div>

      <AddMembersModal
        isOpen={isAddMembersOpen}
        channelName={title}
        currentMembers={channel.member}
        onClose={() => setIsAddMembersOpen(false)}
        onAddMembers={handleAddMembers}
      />
    </>
  );
}

export default PrivateChannelView;
