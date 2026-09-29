import type { ChannelPageDetails } from "~/api/channel/channel.types";
import type { Profile } from "~/api/profile/profile.types";
import type { Friend } from "~/api/friend/friend.types";
import ChannelHeader from "./ChannelHeader";
import MessageList from "./MessageList";
import UserProfilePanel from "./UserProfilePanel";
import { useState } from "react";
import MessageComposer from "./MessageComposer";
import MemberListPanel from "./MemberListPanel";
import AddMembersModal from "./AddMembersModal";

type ChannelDetailPageProps = {
  channelDetails: ChannelPageDetails;
  profile: Profile;
};

export default function ChannelDetailPage({
  channelDetails,
  profile,
}: ChannelDetailPageProps) {
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { isGroupChannel } = channelDetails;

  const peer = !isGroupChannel ? channelDetails.participants[0] : null;
  return (
    <>
      <ChannelHeader
        channelDetails={channelDetails}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <MessageList
            channelDetails={channelDetails}
            onAddMembers={() => setIsAddMembersOpen(true)}
          />
          <MessageComposer
            placeholderTarget={
              channelDetails.isGroupChannel
                ? channelDetails.channel.channelTitle
                : `@${channelDetails.channel.channelTitle}`
            }
            channel={channelDetails.channel}
          />
        </div>

        {isSidePanelOpen &&
          (isGroupChannel ? (
            <MemberListPanel
              members={channelDetails.participants}
              currentUserId={profile.id}
              onAddMembers={() => setIsAddMembersOpen(true)}
            />
          ) : (
            peer && <UserProfilePanel member={peer} profile={profile} />
          ))}
      </div>
      <AddMembersModal
        isOpen={isAddMembersOpen}
        channelDetails={channelDetails}
        friends={channelDetails.friends}
        onClose={() => setIsAddMembersOpen(false)}
        onAddMembers={(members) => {
          // Handle adding members here
          console.log("Added members:", members);
        }}
      />
    </>
  );
}
