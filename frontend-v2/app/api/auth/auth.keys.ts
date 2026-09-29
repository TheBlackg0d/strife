import {
  getRefreshToken,
  getCurrentUser,
  loginRequest,
  registerRequest,
  logoutRequest,
} from "./auth.requests";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  AuthMutation,
  LoginDataForm,
  LogoutMutation,
  RegisterDataForm,
} from "./auth.types";

export enum AuthKeys {
  REFRESH_TOKEN = "REFRESH_TOKEN",
  CURRENT_USER = "CURRENT_USER",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

export const refreshTokenQuery = () =>
  queryOptions({
    queryKey: [AuthKeys.REFRESH_TOKEN],
    queryFn: getRefreshToken,
    staleTime: Infinity,
  });

export const currentUserQuery = () =>
  queryOptions({
    queryKey: [AuthKeys.CURRENT_USER],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

export const loginMutation = (callbacks: AuthMutation) =>
  mutationOptions({
    mutationKey: [AuthKeys.LOGIN],
    mutationFn: (loginDataForm: LoginDataForm) => loginRequest(loginDataForm),
    onSuccess: callbacks.onSuccess,
    onError: callbacks.onError,
    onSettled: callbacks.onSettled,
  });

export const registerMutation = (callbacks: AuthMutation) =>
  mutationOptions({
    mutationKey: [AuthKeys.REGISTER],
    mutationFn: (registerDataForm: RegisterDataForm) =>
      registerRequest(registerDataForm),
    onSuccess: callbacks.onSuccess,
    onError: callbacks.onError,
    onSettled: callbacks.onSettled,
  });

export const logoutMutationOptions = (callbacks: LogoutMutation) =>
  mutationOptions({
    mutationKey: [AuthKeys.LOGOUT],
    mutationFn: () => logoutRequest(),
    onSuccess: callbacks.onSuccess,
    onError: callbacks.onError,
    onSettled: callbacks.onSettled,
  });
