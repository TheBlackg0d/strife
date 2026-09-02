import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import DirectMessageSidebar from "./components/DirectMessageSidebar";
import GuildRail from "./components/GuildRail";
import SettingsModal from "../pages/settings/SettingsModal";
import { conversations, guilds, pendingRequestCount } from "../data/dashboard";
import { logout } from "../auth/session";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createProfileQueryOptions } from "../query-options/profile-query-options";
import { queryClient } from "../main";
import type { ProfileFormValues } from "../types/settings";
import { updateProfile } from "../api/profile";

/** "ada.lovelace@strife.dev" -> "ada.lovelace" */
function displayName(email: string): string {
  return email.split("@")[0];
}

export default function AppLayout() {
  const { data: profileData } = useQuery(createProfileQueryOptions());

  const navigate = useNavigate();

  const [activeGuildId, setActiveGuildId] = useState<string | undefined>();
  const [activeConversationId, setActiveConversationId] = useState<
    string | undefined
  >();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const emailUsername = profileData ? displayName(profileData.email) : "Strife";

  const username = profileData?.username ? profileData.username : emailUsername;

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createProfileQueryOptions().queryKey,
      });
      setIsSettingsOpen(false);
    },
    onError: () => {},
  });

  const handleOnSaveProfile = async (values: ProfileFormValues) => {
    updateProfileMutation.mutateAsync(values);
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutateAsync();
  };

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
        onSaveProfile={handleOnSaveProfile}
        user={{
          username,
          email: profileData?.email ?? "",
          status: "ONLINE",
        }}
      />
    </div>
  );
}
