import type {
  Account,
  AuthResponse,
  LoginDataForm,
  RegisterDataForm,
} from "./auth.types";
import { authApi } from "../api";

export async function getRefreshToken(): Promise<AuthResponse> {
  const response = await authApi.get("/auth/refresh-token");
  return response.data;
}

export async function getCurrentUser(): Promise<Account> {
  const response = await authApi.get("/account/me");
  return response.data;
}

export async function loginRequest(
  loginDataForm: LoginDataForm,
): Promise<AuthResponse> {
  const { data } = await authApi.post<AuthResponse>(
    "/auth/login",
    loginDataForm,
  );
  return data;
}

export async function registerRequest(
  registerDataForm: RegisterDataForm,
): Promise<AuthResponse> {
  const { data } = await authApi.post<AuthResponse>(
    "/auth/register",
    registerDataForm,
  );
  return data;
}

export async function logoutRequest(): Promise<void> {
  await authApi.post("/auth/logout");
}
