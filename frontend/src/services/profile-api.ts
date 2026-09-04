import type { Profile } from "../types/profile";
import type { ProfileFormValues } from "../types/settings";
import { strifeApi } from "./strife-api";

export const profileApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => ({ url: "/profile", method: "GET" }),
      providesTags: [{ type: "Profile", id: "SINGLE_PROFILE" }],
    }),
    updateProfile: builder.mutation<Profile, ProfileFormValues>({
      query: (body) => ({ url: "/profile/update", method: "PUT", body }),
      invalidatesTags: [{ type: "Profile", id: "SINGLE_PROFILE" }],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
