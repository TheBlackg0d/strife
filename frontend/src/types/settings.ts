import type { PresenceStatus } from "./dashboard";

/** Identity shown and edited in the settings modal. */
export interface SettingsUser {
  username: string;
  email: string;
  /** Discriminator shown under the name, e.g. "alex.strife#0001". */
  tag?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  status?: PresenceStatus;
}

/** Editable fields of the "Mon compte" form. */
export interface ProfileFormValues {
  username: string;
  email: string;
  phone: string;
  bio: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Contract every pane of the settings modal is rendered with. */
export interface SettingsSectionProps {
  user: SettingsUser;
  onSaveProfile?: (values: ProfileFormValues) => void;
  onUpdatePassword?: (values: PasswordFormValues) => void;
}

export type SettingsSectionId =
  | "account"
  | "profiles"
  | "privacy"
  | "appearance"
  | "accessibility"
  | "voice";
