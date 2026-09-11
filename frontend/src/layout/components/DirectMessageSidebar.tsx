import { MdGroups, MdInbox, MdPerson } from "react-icons/md";
import DmListItem from "./DmListItem";
import SectionHeader from "./SectionHeader";
import SidebarNavItem from "./SidebarNavItem";
import UserPanel from "./UserPanel";
import type { Conversation } from "../../pages/dashboard/types/dashboard";
import type { PresenceStatus } from "../../types/profile";
import {
  channelTitle,
  isGroupChannel,
  type Channel,
} from "../../pages/channel/types/channel";
import { useGetPrivateChannelListQuery } from "../../services/channel-api";

interface DirectMessageSidebarProps {
  currentUserId?: string;
  currentUsername: string;
  currentUserStatus?: PresenceStatus;
  activeConversationId?: string;
  activeView?: "friends" | "requests";
  pendingRequestCount?: number;
  onSelectConversation?: (conversationId: string) => void;
  onOpenFriends?: () => void;
  onOpenRequests?: () => void;
  onSearch?: () => void;
  onNewConversation?: () => void;
  onOpenSettings?: () => void;
}

function toConversation(
  channel: Channel,
  currentUserId?: string,
): Conversation {
  const isGroup = isGroupChannel(channel);

  return {
    id: channel.id,
    name: channelTitle(channel, currentUserId),
    icon: isGroup ? MdGroups : undefined,
    memberCount: isGroup ? channel.users.length : undefined,
  };
}

function DirectMessageSidebar({
  currentUserId,
  currentUsername,
  currentUserStatus,
  activeConversationId,
  activeView = "friends",
  pendingRequestCount,
  onSelectConversation,
  onOpenFriends,
  onOpenRequests,
  onSearch,
  onNewConversation,
  onOpenSettings,
}: DirectMessageSidebarProps) {
  const { data: channels } = useGetPrivateChannelListQuery();

  const conversations = (channels ?? []).map((channel) =>
    toConversation(channel, currentUserId),
  );

  return (
    <aside className="flex h-full w-dm-sidebar shrink-0 flex-col bg-surface-container-low">
      <div className="flex h-12 shrink-0 items-center border-b border-surface-container-lowest/50 px-2">
        <button
          type="button"
          onClick={onSearch}
          className="w-full cursor-pointer truncate rounded-sm bg-background px-2 py-1.5 text-left text-[13px] text-on-surface-variant transition-colors hover:bg-surface-container-highest"
        >
          Rechercher ou lancer une conversation
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        <SidebarNavItem
          icon={MdPerson}
          label="Amis"
          isActive={activeView === "friends" && !activeConversationId}
          onClick={onOpenFriends}
        />
        <SidebarNavItem
          icon={MdInbox}
          label="Demandes de message"
          isActive={activeView === "requests"}
          badge={pendingRequestCount}
          onClick={onOpenRequests}
        />

        <div className="mt-2">
          <SectionHeader
            title="MESSAGES PRIVÉS"
            onAdd={onNewConversation}
            addLabel="Nouvelle conversation"
          />
        </div>

        {conversations.map((conversation) => (
          <DmListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>

      <UserPanel
        username={currentUsername}
        status={currentUserStatus}
        onOpenSettings={onOpenSettings}
      />
    </aside>
  );
}

export default DirectMessageSidebar;
