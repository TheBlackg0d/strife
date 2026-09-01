import {
  MdCode,
  MdGroups,
  MdPlayArrow,
  MdSmartToy,
  MdTerminal,
} from "react-icons/md";
import type {
  Conversation,
  Friend,
  Guild,
} from "../pages/dashboard/types/dashboard";

/**
 * Placeholder content for the dashboard shell.
 * Replace each export with a react-query hook once the guild/friend
 * services are available behind the gateway.
 */

export const guilds: Guild[] = [
  { id: "g1", name: "Neon Arcade" },
  { id: "g2", name: "Design Arch" },
  { id: "g3", name: "Dev Terminal", icon: MdTerminal },
  { id: "g4", name: "Retro Club" },
];

export const conversations: Conversation[] = [
  { id: "c1", name: "CyberNinja", statusPreference: "ONLINE" },
  { id: "c2", name: "DesignArch", statusPreference: "OFFLINE" },
  { id: "c3", name: "Project Alpha Team", memberCount: 3, icon: MdGroups },
  { id: "c4", name: "DevExpert", statusPreference: "DO_NOT_DISTURB" },
];

export const friends: Friend[] = [
  {
    id: "f1",
    username: "CyberNinja",
    tag: "#1337",
    statusPreference: "ONLINE",
    activity: {
      verb: "Joue à",
      target: "Visual Studio Code",
      icon: MdCode,
      tone: "primary",
    },
  },
  {
    id: "f2",
    username: "DesignArch",
    statusPreference: "OFFLINE",
    activity: { verb: "Mapping out the design system" },
  },
  {
    id: "f3",
    username: "DevExpert",
    statusPreference: "DO_NOT_DISTURB",
    activity: {
      verb: "Coding in",
      target: "Rust",
      icon: MdTerminal,
      tone: "neutral",
    },
  },
  {
    id: "f4",
    username: "MusicBot",
    statusPreference: "ONLINE",
    isBot: true,
    icon: MdSmartToy,
    activity: {
      verb: "Listening to",
      target: "Spotify",
      icon: MdPlayArrow,
      tone: "secondary",
    },
  },
];

export const pendingRequestCount = 1;
