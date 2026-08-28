import { useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router";
import DirectMessageSidebar from "./components/DirectMessageSidebar";
import GuildRail from "./components/GuildRail";
import { conversations, guilds, pendingRequestCount } from "../data/dashboard";
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

  // TODO: promote to route params (/channels/:guildId/:conversationId)
  // once guild and DM routes exist.
  const [activeGuildId, setActiveGuildId] = useState<string | undefined>();
  const [activeConversationId, setActiveConversationId] = useState<
    string | undefined
  >();

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
        currentUsername={data ? displayName(data.account.email) : "Strife"}
        currentUserStatus="online"
        activeConversationId={activeConversationId}
        pendingRequestCount={pendingRequestCount}
        onSelectConversation={setActiveConversationId}
        onOpenFriends={() => setActiveConversationId(undefined)}
      />

      <main className="flex min-w-0 flex-1 flex-col bg-surface">
        <Outlet />
      </main>
    </div>
  );
}
