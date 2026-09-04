import type { ComponentType } from "react";
import type { IconType } from "react-icons";
import {
  MdAccessibilityNew,
  MdAdminPanelSettings,
  MdMic,
  MdPalette,
  MdPerson,
  MdSecurity,
} from "react-icons/md";
import PlaceholderSection from "./components/PlaceholderSection";
import MyAccountSection from "./sections/MyAccountSection";
import PrivacySection from "./sections/PrivacySection";
import type { SettingsSectionId } from "../../types/settings";

export interface SettingsSectionEntry {
  id: SettingsSectionId;
  /** Nav label, also used as the modal heading. */
  label: string;
  icon: IconType;
  Component: ComponentType;
}

export interface SettingsNavGroup {
  title: string;
  items: SettingsSectionEntry[];
}

/**
 * Single source of truth for the modal: adding a settings pane means adding
 * one entry here — the sidebar, the heading and the router follow.
 */
export const settingsNavGroups: SettingsNavGroup[] = [
  {
    title: "Paramètres utilisateur",
    items: [
      {
        id: "account",
        label: "Mon compte",
        icon: MdPerson,
        Component: MyAccountSection,
      },
      {
        id: "profiles",
        label: "Profils",
        icon: MdAdminPanelSettings,
        Component: () => (
          <PlaceholderSection
            title="Profils"
            description="Personnalisation de l'avatar, de la bannière et des profils par serveur. À venir."
          />
        ),
      },
      {
        id: "privacy",
        label: "Confidentialité & sécurité",
        icon: MdSecurity,
        Component: PrivacySection,
      },
    ],
  },
  {
    title: "Paramètres de l'application",
    items: [
      {
        id: "appearance",
        label: "Apparence",
        icon: MdPalette,
        Component: () => (
          <PlaceholderSection
            title="Apparence"
            description="Thème, densité d'affichage et taille de police. À venir."
          />
        ),
      },
      {
        id: "accessibility",
        label: "Accessibilité",
        icon: MdAccessibilityNew,
        Component: () => (
          <PlaceholderSection
            title="Accessibilité"
            description="Réduction des animations, contraste élevé et raccourcis clavier. À venir."
          />
        ),
      },
      {
        id: "voice",
        label: "Voix & vidéo",
        icon: MdMic,
        Component: () => (
          <PlaceholderSection
            title="Voix & vidéo"
            description="Périphériques d'entrée et de sortie, suppression du bruit et mode push-to-talk. À venir."
          />
        ),
      },
    ],
  },
];

const sectionsById = new Map(
  settingsNavGroups.flatMap((group) =>
    group.items.map((item) => [item.id, item] as const),
  ),
);

export function getSection(id: SettingsSectionId): SettingsSectionEntry {
  const section = sectionsById.get(id);
  if (!section) {
    throw new Error(`Unknown settings section: ${id}`);
  }
  return section;
}
