import type { Response } from "../types/generic";
import type { Profile } from "../types/profile";
import type { PasswordFormValues, ProfileFormValues } from "../types/settings";
import { api } from "./api";

export async function updateProfile(profile: ProfileFormValues) {
  const response = await api.put<Profile>("/profile/update", profile);
  return response.data;
}

export async function getProfile() {
  const response = await api.get<Profile>("/profile");
  return response.data;
}

export async function updatePassword(form: PasswordFormValues) {
  const response = await api.post<Response>("account/change-password", form);
  return response.data;
}
