import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfileQueryOptions,
  updateProfileMutationOptions,
} from "./profile.keys";
import type { Profile } from "./profile.types";

export function useProfileQuery() {
  return useQuery(getProfileQueryOptions());
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  const onSuccess = (data: Profile) => {
    queryClient.setQueryData<Profile>(getProfileQueryOptions().queryKey, data);
  };

  const onError = (error: unknown) => {
    console.error("Failed to update profile:", error);
  };

  return useMutation(updateProfileMutationOptions({ onSuccess, onError }));
}
