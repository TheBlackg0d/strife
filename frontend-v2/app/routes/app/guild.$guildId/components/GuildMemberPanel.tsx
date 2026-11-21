import type { GuildMember } from "~/api/guild/guild.types";
import MemberRow from "~/routes/app/channel.$channelId/components/MemberRow";

interface GuildMemberPanelProps {
  members: GuildMember[];
  currentUserId?: string;
}

function GuildMemberPanel({ members, currentUserId }: GuildMemberPanelProps) {
  const sortedMembers = [...members].sort((a, b) =>
    a.username.localeCompare(b.username),
  );

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
          {sortedMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUserId}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default GuildMemberPanel;
