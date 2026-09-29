import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getProfile, updateProfile } from "./profile.requests";
import type { ProfileFormValues, ProfileMutation } from "./profile.types";

export enum ProfileKeys {
  PROFILE = "PROFILE",
  UPDATE_PROFILE = "UPDATE_PROFILE",
}

function getProfileQueryOptions() {
  return queryOptions({
    queryKey: [ProfileKeys.PROFILE],
    queryFn: () => getProfile(),
    staleTime: Infinity,
  });
}

function updateProfileMutationOptions(callbacks?: ProfileMutation) {
  return mutationOptions({
    mutationKey: [ProfileKeys.UPDATE_PROFILE],
    mutationFn: (profile: ProfileFormValues) => updateProfile(profile),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onSettled: callbacks?.onSettled,
  });
}

export { getProfileQueryOptions, updateProfileMutationOptions };
