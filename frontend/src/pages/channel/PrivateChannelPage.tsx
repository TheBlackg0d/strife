import { useParams } from "react-router";
import PrivateChannelView from "./components/PrivateChannelView";
import { channelMessages, privateChannels } from "../../data/channels";

/**
 * Private channel route. Two members means a DM — the right pane shows the
 * other user's profile; beyond two it is a group and the right pane becomes
 * the member list with its invite button.
 */
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
