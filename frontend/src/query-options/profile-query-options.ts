import { queryOptions } from "@tanstack/react-query";
import type { Profile } from "../types/profile";
import { getProfile } from "../api/profile";

export function createProfileQueryOptions() {
  return queryOptions<Profile>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}
