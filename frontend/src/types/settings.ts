import type { PresenceStatus } from "./profile";

export interface SettingsUser {
  username: string;
  email: string;
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
  bio: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type SettingsSectionId =
  | "account"
  | "profiles"
  | "privacy"
  | "appearance"
  | "accessibility"
  | "voice";
