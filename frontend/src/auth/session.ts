import axios from "axios";
import type {
  AuthResponse,
  LoginCredential,
  RegisterCredential,
  Account,
} from "./types/auth";
import { clearSession, getAccount, setSession } from "./tokenStore";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  withCredentials: true,
});

let refreshTokenPromise: Promise<Account> | null = null;

export function refreshSession(): Promise<Account> {
  refreshTokenPromise ??= authApi
    .post<AuthResponse>("auth/refresh-token")
    .then(({ data }) => {
      setSession(data.accessToken, data.account);
      return data.account;
    })
    .catch((error) => {
      clearSession();
      throw error;
    })
    .finally(() => {
      refreshTokenPromise = null;
    });

  return refreshTokenPromise;
}

export async function ensureAccount(): Promise<Account> {
  const account = getAccount();
  if (account) {
    return account;
  }

  return refreshSession();
}

export async function login({
  email,
  password,
}: LoginCredential): Promise<Account> {
  const { data } = await authApi.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  setSession(data.accessToken, data.account);
  return data.account;
}

export async function register(
  registerCredential: RegisterCredential,
): Promise<Account> {
  const { data } = await authApi.post<AuthResponse>(
    "auth/register",
    registerCredential,
  );
  setSession(data.accessToken, data.account);
  return data.account;
}

export async function logout(): Promise<void> {
  try {
    await authApi.post("auth/logout");
  } finally {
    clearSession();
  }
}
