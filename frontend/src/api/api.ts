import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { clearSession, getAccessToken } from "../auth/tokenStore";
import { refreshSession } from "../auth/session";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.BASE_URL ?? "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
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
      await refreshSession();
    } catch {
      clearSession();
      throw error;
    }

    original.headers.Authorization = `Bearer ${getAccessToken()}`;
    return api(original);
  },
);
