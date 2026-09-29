import { api } from "../api";
import type { Profile } from "./profile.types";
import type { ProfileFormValues } from "./profile.types";

async function getProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("/profile");
  return data;
}

async function updateProfile(profile: ProfileFormValues): Promise<Profile> {
  const { data } = await api.put<Profile>("/profile/update", profile);
  return data;
}

export { getProfile, updateProfile };
