import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./base-query-with-auth";

export const strifeApi = createApi({
  reducerPath: "strifeApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Profile", "Friends", "Account", "Channels", "PrivateChannels"],
  endpoints: () => ({}),
});

export const strifeAuthApi = createApi({
  reducerPath: "strifeAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});
