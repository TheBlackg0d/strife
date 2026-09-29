import { Outlet, useMatch, useNavigate } from "react-router";
import type { Route } from "./+types/AppLayout";
import GuildList from "./components/guildSideBar/GuildList";
import { guilds, pendingRequestCount } from "~/data/dashboard";

import { useState } from "react";
import DirectMessageSidebar from "./components/directMessage/DirectMessageSidebar";
import SidebarNavItem from "./components/directMessage/SidebarNavItem";
import { MdGroups, MdInbox, MdPerson } from "react-icons/md";
import SectionHeader from "./components/directMessage/SectionHeader";
import DmList from "./components/directMessage/DmList";
import { getQueryClient } from "~/lib/query-client";
import { getPrivateChannelListQueryOptions } from "~/api/channel/channel.keys";
import { getProfileQueryOptions } from "~/api/profile/profile.keys";
import { authMiddleware } from "~/lib/auth-middleware";
import type { Channel } from "~/api/channel/channel.types";
import SettingsModal from "~/shared/settings/SettingsModal";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

export async function clientLoader() {
  const queryClient = getQueryClient();
  const [profile, channelList] = await Promise.all([
    queryClient.query({ ...getProfileQueryOptions() }),
    queryClient.query({
      ...getPrivateChannelListQueryOptions(),
    }),
  ]);

  return { profile, channelList };
}

// export function HydrateFallback() {
//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-zinc-900">
//       <div className="size-8 animate-spin rounded-full border-4 border-zinc-600 border-t-white" />
//     </div>
//   );
// }

function AppLayout({ loaderData }: Route.ComponentProps) {
  const { profile, channelList } = loaderData;
  const [activeGuildId, setActiveGuildId] = useState<string | undefined>(
    undefined,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"friends" | "requests">(
    "friends",
  );

  const channelMatch = useMatch("/channels/:channelId");
  const activeConversationId = channelMatch?.params.channelId;

  const conversations = channelList.map((channel) => {
    return {
      id: channel.id,
      name: channel.channelTitle,
      icon: channel.type === "GROUP_DM" ? MdGroups : undefined,
      memberCount: channel.memberCount,
    };
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <GuildList
        guilds={guilds}
        activeGuildId={activeGuildId}
        onSelectGuild={setActiveGuildId}
        onSelectHome={() => setActiveGuildId(undefined)}
      />
      <DirectMessageSidebar
        profile={profile}
        onSearch={() => {}}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        <SidebarNavItem
          icon={MdPerson}
          label="Amis"
          isActive={activeView === "friends" && !activeConversationId}
          onClick={() => navigate("/")}
        />
        <SidebarNavItem
          icon={MdInbox}
          label="Demandes de message"
          isActive={activeView === "requests"}
          badge={pendingRequestCount}
          onClick={() => navigate("/requests")}
        />

        <div className="mt-2">
          <SectionHeader
            title="MESSAGES PRIVÉS"
            addLabel="Nouvelle conversation"
          />
        </div>
        <DmList conversations={conversations} />
      </DirectMessageSidebar>
      <main className="flex min-w-0 flex-1 flex-col bg-surface">
        <Outlet />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default AppLayout;
