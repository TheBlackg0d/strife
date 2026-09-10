import { useState } from "react";
import AddMembersModal from "./AddMembersModal";
import ChannelHeader from "./ChannelHeader";
import MemberListPanel from "./MemberListPanel";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import UserProfilePanel from "./UserProfilePanel";
import { useGetProfileQuery } from "../../../services/profile-api";
import {
  channelTitle,
  isGroupChannel,
  otherUser,
  type Channel,
  type Message,
  type User,
} from "../types/channel";

interface ChannelViewProps {
  channel: Channel;
  messages: Message[];
}

function ChannelView({ channel, messages }: ChannelViewProps) {
  const { data: profile } = useGetProfileQuery();
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  const currentUserId = profile?.id;
  const isGroup = isGroupChannel(channel);
  const peer = otherUser(channel, currentUserId);
  const title = channelTitle(channel, currentUserId);
  const members = [...channel.users, ...invitedMembers];

  const handleSend = (content: string) => {
    if (!profile) {
      return;
    }

    setPendingMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        channelId: channel.id,
        content,
        media: null,
        sender: { id: profile.id, username: profile.username },
        timestamp: new Date().toISOString(),
        editedAt: null,
      },
    ]);
  };

  const handleAddMembers = (invited: User[]) => {
    setInvitedMembers((previous) => [...previous, ...invited]);
  };

  return (
    <>
      <ChannelHeader
        title={title}
        isGroup={isGroup}
        memberCount={members.length}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen((open) => !open)}
        onAddMembers={() => setIsAddMembersOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <MessageList
            channelId={channel.id}
            title={title}
            isGroup={isGroup}
            memberCount={members.length}
            messages={[...messages, ...pendingMessages]}
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
              members={members}
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
        currentMembers={members}
        onClose={() => setIsAddMembersOpen(false)}
        onAddMembers={handleAddMembers}
      />
    </>
  );
}

export default ChannelView;
