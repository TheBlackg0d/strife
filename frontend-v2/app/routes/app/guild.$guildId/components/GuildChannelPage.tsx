import { useState } from "react";
import type { ChannelPageDetails } from "~/api/channel/channel.types";
import type { GuildDetails } from "~/api/guild/guild.types";
import type { Profile } from "~/api/profile/profile.types";
import MessageComposer from "~/routes/app/channel.$channelId/components/MessageComposer";
import MessageList from "~/routes/app/channel.$channelId/components/MessageList";
import GuildChannelHeader from "./GuildChannelHeader";
import GuildMemberPanel from "./GuildMemberPanel";

type GuildChannelPageProps = {
  guild: GuildDetails;
  channelDetails: ChannelPageDetails;
  profile: Profile;
};

export default function GuildChannelPage({
  guild,
  channelDetails,
  profile,
}: GuildChannelPageProps) {
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);
  const channelName = channelDetails.channel.channelTitle;

  return (
    <>
      <GuildChannelHeader
        channelName={channelName}
        guildName={guild.name}
        isMemberListOpen={isMemberListOpen}
        onToggleMemberList={() => setIsMemberListOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <MessageList channelDetails={channelDetails} />
          <MessageComposer
            placeholderTarget={`#${channelName}`}
            channel={channelDetails.channel}
          />
        </div>

        {isMemberListOpen && (
          <GuildMemberPanel
            members={guild.members}
            currentUserId={profile.id}
          />
        )}
      </div>
    </>
  );
}
