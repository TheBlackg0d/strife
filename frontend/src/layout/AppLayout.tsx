import { useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router";
import DirectMessageSidebar from "./components/DirectMessageSidebar";
import GuildRail from "./components/GuildRail";
import SettingsModal from "../pages/settings/SettingsModal";
import { conversations, guilds, pendingRequestCount } from "../data/dashboard";

import { useGetProfileQuery } from "../services/profile-api";

/** "ada.lovelace@strife.dev" -> "ada.lovelace" */
function displayName(email: string): string {
  return email.split("@")[0];
}

export default function AppLayout() {
  const { data: profileData } = useGetProfileQuery();

  const navigate = useNavigate();
  const channelMatch = useMatch("/channels/:channelId");
  const activeConversationId = channelMatch?.params.channelId;

  const [activeGuildId, setActiveGuildId] = useState<string | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const emailUsername = profileData ? displayName(profileData.email) : "Strife";

  const username = profileData?.username ? profileData.username : emailUsername;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <GuildRail
        guilds={guilds}
        activeGuildId={activeGuildId}
        onSelectGuild={setActiveGuildId}
        onSelectHome={() => setActiveGuildId(undefined)}
      />

      <DirectMessageSidebar
        conversations={conversations}
        currentUsername={username}
        currentUserStatus="ONLINE"
        activeConversationId={activeConversationId}
        pendingRequestCount={pendingRequestCount}
        onSelectConversation={(conversationId) =>
          navigate(`/channels/${conversationId}`)
        }
        onOpenFriends={() => navigate("/")}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

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
