import { useParams } from "react-router";
import PrivateChannelView from "./components/PrivateChannelView";
import { channelMessages, privateChannels } from "../../data/channels";

function PrivateChannelPage() {
  const { channelId } = useParams();
  const channel = privateChannels.find(({ id }) => id === channelId);

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-[15px] text-outline">
        Cette conversation n'existe pas.
      </div>
    );
  }

  return (
    <PrivateChannelView
      key={channel.id}
      initialChannel={channel}
      initialMessages={channelMessages[channel.id] ?? []}
    />
  );
}

export default PrivateChannelPage;
