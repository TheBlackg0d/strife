import type { Profile } from "~/api/profile/profile.types";
import StrifeInput from "~/components/strife/StrifeInput";
import UserPanel from "~/api/guild/UserPanel";

interface DirectMessageSidebarProps {
  profile: Profile;
  children?: React.ReactNode;
  onSearch?: () => void;
  onOpenSettings?: () => void;
}

function DirectMessageSidebar({
  profile,
  onSearch,
  onOpenSettings,
  children,
}: DirectMessageSidebarProps) {
  return (
    <aside className="flex h-full w-dm-sidebar shrink-0 flex-col bg-surface-container-low">
      <div className="flex h-12 shrink-0 items-center border-b border-surface-container-lowest/50 px-2">
        <StrifeInput
          type="text"
          onClick={onSearch}
          placeholder="Rechercher ou lancer une conversation"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        {children}
      </div>

      <UserPanel profile={profile} onOpenSettings={onOpenSettings} />
    </aside>
  );
}

export default DirectMessageSidebar;
