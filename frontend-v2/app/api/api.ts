import axios from "axios";
import { refreshTokenQuery } from "./auth/auth.keys";
import { getQueryClient } from "~/lib/query-client";
import type { AuthResponse, RetriableRequestConfig } from "./auth/auth.types";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authData: AuthResponse = getQueryClient().getQueryData(
    refreshTokenQuery().queryKey,
  ) as AuthResponse;
  const token = authData?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    const original = error.config as RetriableRequestConfig | undefined;

    if (!original || error.response?.status !== 401 || original._retried) {
      throw error;
    }

    original._retried = true;

    try {
      const data = await getQueryClient().query({
        ...refreshTokenQuery(),
        staleTime: 0,
      });
      if (!data?.accessToken) {
        throw new Error("Failed to refresh access token");
      }

      original.headers.Authorization = `Bearer ${data.accessToken}`;
    } catch (refreshError) {
      throw refreshError;
    }

    return api(original);
  },
);
