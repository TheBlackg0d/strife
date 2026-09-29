import { MdGroups } from "react-icons/md";
import type { ChannelPageDetails } from "~/api/channel/channel.types";
import Avatar from "~/components/strife/Avatar";
import Button from "~/components/strife/StrifeButton";

interface ChannelIntroProps {
  channelDetails: ChannelPageDetails;
  onAddMembers?: () => void;
  onBlock?: () => void;
}

function ChannelIntro({
  channelDetails,
  onAddMembers,
  onBlock,
}: ChannelIntroProps) {
  const { channel, isGroupChannel } = channelDetails;
  return (
    <div className="mb-6 pt-4">
      <Avatar
        name={channel.channelTitle}
        icon={isGroupChannel ? MdGroups : undefined}
        size={80}
        className="mb-4"
      />

      <h2 className="text-[32px] leading-tight font-bold text-on-surface">
        {channel.channelTitle}
      </h2>

      {isGroupChannel ? (
        <p className="mt-2 text-[15px] text-on-surface-variant">
          Bienvenue au tout début du groupe{" "}
          <span className="font-semibold text-on-surface">
            {channel.channelTitle}
          </span>
          , qui compte {channel.memberCount} membres.
        </p>
      ) : (
        <p className="mt-2 text-[15px] text-on-surface-variant">
          Ceci est le début de l'historique de tes messages privés avec{" "}
          <span className="font-semibold text-on-surface">
            @{channel.channelTitle}
          </span>
          .
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isGroupChannel ? (
          <Button variant="neutral" onClick={onAddMembers}>
            Inviter des membres
          </Button>
        ) : (
          <>
            <span className="mr-2 text-[13px] text-outline">
              Pas d'amis en commun
            </span>
            <Button variant="neutral" onClick={onBlock}>
              Bloquer
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChannelIntro;
