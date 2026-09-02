import { MdGroups, MdSmartToy, MdTerminal } from "react-icons/md";
import type {
  Conversation,
  Friend,
  Guild,
} from "../pages/dashboard/types/dashboard";

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
    email: "cyber.ninja@example.com",
    tag: "#1337",
    statusPreference: "ONLINE",
  },
  {
    id: "f2",
    username: "DesignArch",
    email: "design.arch@example.com",
    tag: "#42",
    statusPreference: "OFFLINE",
  },
  {
    id: "f3",
    username: "DevExpert",
    email: "dev.expert@example.com",

    statusPreference: "DO_NOT_DISTURB",
  },
  {
    id: "f4",
    username: "MusicBot",
    email: "music.bot@example.com",
    statusPreference: "ONLINE",
    isBot: true,
    icon: MdSmartToy,
  },
];

export const pendingRequestCount = 1;
