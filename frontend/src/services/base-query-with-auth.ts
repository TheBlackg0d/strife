import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import type { RootState } from "../store/store";
import { loggedOut, tokenReceived } from "../store/slices/auth-slice";
import type { AuthResponse } from "../auth/types/auth";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
    return baseQuery(args, api, extraOptions);
  }

  const release = await mutex.acquire();

  try {
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      api.dispatch(tokenReceived(refreshResult.data as AuthResponse));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(loggedOut());
    }
  } finally {
    release();
  }

  return result;
};
