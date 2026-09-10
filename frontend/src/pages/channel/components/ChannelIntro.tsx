import { MdGroups } from "react-icons/md";
import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";

interface ChannelIntroProps {
  memberCount: number;
  isGroup: boolean;
  title: string;
  onAddMembers?: () => void;
  onBlock?: () => void;
}

function ChannelIntro({
  memberCount,
  isGroup,
  title,
  onAddMembers,
  onBlock,
}: ChannelIntroProps) {
  return (
    <div className="mb-6 pt-4">
      <Avatar
        name={title}
        icon={isGroup ? MdGroups : undefined}
        size={80}
        className="mb-4"
      />

      <h2 className="text-[32px] leading-tight font-bold text-on-surface">
        {title}
      </h2>

      {isGroup ? (
        <p className="mt-2 text-[15px] text-on-surface-variant">
          Bienvenue au tout début du groupe{" "}
          <span className="font-semibold text-on-surface">{title}</span>, qui
          compte {memberCount} membres.
        </p>
      ) : (
        <p className="mt-2 text-[15px] text-on-surface-variant">
          Ceci est le début de l'historique de tes messages privés avec{" "}
          <span className="font-semibold text-on-surface">@{title}</span>.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isGroup ? (
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
