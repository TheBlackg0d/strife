import Avatar from "../../../components/ui/Avatar";
import type { User } from "../types/channel";

interface MemberRowProps {
  member: User;
  isCurrentUser?: boolean;
  onSelect?: (userId: string) => void;
}

function MemberRow({ member, isCurrentUser, onSelect }: MemberRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(member.id)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 text-left text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
      >
        <Avatar name={member.username} size={32} ring="surface-container-low" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
          {member.username}
        </span>
        {isCurrentUser && (
          <span className="shrink-0 font-label text-[10px] text-outline">
            toi
          </span>
        )}
      </button>
    </li>
  );
}

export default MemberRow;
