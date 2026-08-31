import { useState } from "react";
import { Outlet, useNavigate, useRouteLoaderData } from "react-router";
import DirectMessageSidebar from "./components/DirectMessageSidebar";
import GuildRail from "./components/GuildRail";
import SettingsModal from "../pages/settings/SettingsModal";
import { conversations, guilds, pendingRequestCount } from "../data/dashboard";
import { logout } from "../auth/session";
import type { ProtectedLoaderData } from "../router/routes";

/** "ada.lovelace@strife.dev" -> "ada.lovelace" */
function displayName(email: string): string {
  return email.split("@")[0];
}

/**
 * Three-pane application shell (DESIGN.md > Layout & Spacing):
 * guild rail (72px) + contextual nav (240px) + fluid main stage.
 */
export default function AppLayout() {
  const data = useRouteLoaderData<ProtectedLoaderData>("protected");
  const navigate = useNavigate();

  // TODO: promote to route params (/channels/:guildId/:conversationId)
  // once guild and DM routes exist.
  const [activeGuildId, setActiveGuildId] = useState<string | undefined>();
  const [activeConversationId, setActiveConversationId] = useState<
    string | undefined
  >();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const username = data ? displayName(data.account.email) : "Strife";

  async function handleLogout() {
    await logout();
    setIsSettingsOpen(false);
    navigate("/login", { replace: true });
  }

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
        currentUserStatus="online"
        activeConversationId={activeConversationId}
        pendingRequestCount={pendingRequestCount}
        onSelectConversation={setActiveConversationId}
        onOpenFriends={() => setActiveConversationId(undefined)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex min-w-0 flex-1 flex-col bg-surface">
        <Outlet />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        user={{
          username,
          email: data?.account.email ?? "",
          status: "online",
        }}
      />
    </div>
  );
}
