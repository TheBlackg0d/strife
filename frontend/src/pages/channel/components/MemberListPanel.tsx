import { MdGroupAdd } from "react-icons/md";
import MemberRow from "./MemberRow";
import type { Member } from "../types/channel";

interface MemberListPanelProps {
  members: Member[];
  currentUserId?: string;
  onAddMembers: () => void;
}

function MemberListPanel({
  members,
  currentUserId,
  onAddMembers,
}: MemberListPanelProps) {
  return (
    <aside
      aria-label="Liste des membres"
      className="flex h-full w-60 shrink-0 flex-col bg-surface-container-low"
    >
      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="px-2 py-2 font-label text-xs font-bold tracking-wide text-outline">
          MEMBRES — {members.length}
        </h2>

        <ul className="flex flex-col gap-0.5">
          {members.map((member) => (
            <MemberRow
              key={member.userId}
              member={member}
              isCurrentUser={member.userId === currentUserId}
            />
          ))}
        </ul>
      </div>

      <div className="shrink-0 p-2">
        <button
          type="button"
          onClick={onAddMembers}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary-container px-3 py-2 text-[14px] font-medium text-on-primary-container transition-colors hover:bg-primary-container/90"
        >
          <MdGroupAdd size={18} />
          <span className="truncate">Inviter dans le groupe privé</span>
        </button>
      </div>
    </aside>
  );
}

export default MemberListPanel;
