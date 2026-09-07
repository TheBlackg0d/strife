import Avatar from "../../../components/ui/Avatar";
import { useGetFriendsQuery } from "../../../services/friend-api";
import type { PresenceStatus } from "../../../types/profile";
import type { Member } from "../types/channel";

const statusLabel: Record<PresenceStatus, string> = {
  ONLINE: "En ligne",
  INACTIVE: "Inactif",
  DO_NOT_DISTURB: "Ne pas déranger",
  OFFLINE: "Hors ligne",
  INVISIBLE: "Invisible",
};

interface UserProfilePanelProps {
  member: Member;
}

/**
 * Right pane of a two-person private channel. The channel DTO only carries
 * the id and the username, so the richer profile fields are looked up in the
 * friend list and simply omitted when the member isn't a friend.
 */
function UserProfilePanel({ member }: UserProfilePanelProps) {
  const { data: friends } = useGetFriendsQuery();

  const profile = (friends?.ALL ?? []).find(
    (friend) =>
      friend.id === member.userId || friend.username === member.username,
  );

  return (
    <aside
      aria-label={`Profil de ${member.username}`}
      className="flex h-full w-70 shrink-0 flex-col overflow-y-auto bg-surface-container-low"
    >
      <div className="h-30 shrink-0 bg-primary-container/40" />

      <div className="-mt-10 px-4">
        <div className="w-fit rounded-full bg-surface-container-low p-1.5">
          <Avatar
            name={member.username}
            imageUrl={profile?.imageUrl}
            icon={profile?.icon}
            status={profile?.statusPreference}
            size={80}
            ring="surface-container-low"
          />
        </div>
      </div>

      <div className="m-4 rounded-lg border border-surface-variant/50 bg-surface-container-lowest p-4">
        <div className="border-b border-surface-variant/50 pb-2">
          <h2 className="text-xl leading-tight font-bold text-on-surface">
            {member.username}
          </h2>
          {profile?.tag && (
            <p className="text-[14px] font-medium text-on-surface-variant">
              {profile.tag}
            </p>
          )}
        </div>

        {profile?.statusPreference && (
          <section className="pt-3">
            <h3 className="mb-1 font-label text-xs font-bold text-on-surface-variant uppercase">
              Statut
            </h3>
            <p className="text-[14px] text-on-surface">
              {statusLabel[profile.statusPreference]}
            </p>
          </section>
        )}

        {profile?.bio && (
          <section className="pt-3">
            <h3 className="mb-1 font-label text-xs font-bold text-on-surface-variant uppercase">
              À propos de moi
            </h3>
            <p className="text-[13px] leading-snug text-on-surface">
              {profile.bio}
            </p>
          </section>
        )}

        <section className="pt-3">
          <h3 className="mb-2 font-label text-xs font-bold text-on-surface-variant uppercase">
            Note
          </h3>
          <textarea
            placeholder="Clique pour ajouter une note"
            aria-label={`Note à propos de ${member.username}`}
            className="h-16 w-full resize-none rounded-sm border border-surface-variant bg-surface-container-low p-2 text-xs text-on-surface placeholder:text-outline-variant focus:border-primary-container focus:ring-0 focus:outline-none"
          />
        </section>
      </div>
    </aside>
  );
}

export default UserProfilePanel;
