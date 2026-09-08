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
  otherUser,
  type User,
  type Message,
  type PrivateChannel,
} from "../types/channel";

interface PrivateChannelViewProps {
  initialChannel: PrivateChannel;
  initialMessages: Message[];
}

function PrivateChannelView({
  initialChannel,
  initialMessages,
}: PrivateChannelViewProps) {
  const [channel, setChannel] = useState(initialChannel);
  const [messages, setMessages] = useState(initialMessages);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  const isGroup = isGroupChannel(channel);
  const peer = otherUser(channel, currentUserId);
  const title = isGroup
    ? channel.channelName
    : (peer?.username ?? channel.channelName);

  const handleSend = (content: string) => {
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        content,
        sender: { id: currentUserId, username: "UserOne" },
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleAddMembers = (invited: User[]) => {
    setChannel((previous) => ({
      ...previous,
      users: [...previous.users, ...invited],
    }));
  };

  return (
    <>
      <ChannelHeader
        title={title}
        isGroup={isGroup}
        memberCount={channel.users.length}
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
              members={channel.users}
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
        currentMembers={channel.users}
        onClose={() => setIsAddMembersOpen(false)}
        onAddMembers={handleAddMembers}
      />
    </>
  );
}

export default PrivateChannelView;
