import { useParams } from "react-router";
import ChannelView from "./components/ChannelView";
import { useGetChannelQuery } from "../../services/channel-api";
import { useGetMessagesForChannelQuery } from "../../services/message-api";

function ChannelPage() {
  const { channelId } = useParams();

  const { data: channel, isLoading } = useGetChannelQuery(channelId ?? "", {
    skip: !channelId,
  });
  const { data: messages } = useGetMessagesForChannelQuery(channelId ?? "", {
    skip: !channelId,
  });

  if (isLoading) {
    return null;
  }

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[15px] text-outline">
        Cette conversation n'existe pas.
      </div>
    );
  }

  return (
    <ChannelView
      key={channel.id}
      channel={channel}
      messages={messages ?? []}
    />
  );
}

export default ChannelPage;
