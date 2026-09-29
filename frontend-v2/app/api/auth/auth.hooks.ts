import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import {
  currentUserQuery,
  loginMutation,
  logoutMutationOptions,
  refreshTokenQuery,
  registerMutation,
} from "./auth.keys";
import type { AuthResponse } from "./auth.types";

export function useRefreshToken() {
  return useQuery(refreshTokenQuery());
}

export function useCurrentUser() {
  return useQuery(currentUserQuery());
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const onSuccess = (data: AuthResponse) => {
    console.log("Login successful");
    queryClient.setQueryData(refreshTokenQuery().queryKey, data);
    navigate(
      redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
        ? redirectTo
        : "/dashboard",
    );
  };

  const onError = (error: unknown) => {
    console.error("Login error:", error);
  };

  const onSettled = () => {
    console.log("Login settled");
  };

  return useMutation(loginMutation({ onSuccess, onError, onSettled }));
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSuccess = (data: AuthResponse) => {
    console.log("Register successful");
    queryClient.setQueryData(refreshTokenQuery().queryKey, data);
    navigate("/dashboard");
  };

  const onError = (error: unknown) => {
    console.error("Register error:", error);
  };

  const onSettled = () => {
    console.log("Register settled");
  };

  return useMutation(registerMutation({ onSuccess, onError, onSettled }));
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    console.log("Logout successful");
    queryClient.clear();
  };

  const onError = (error: unknown) => {
    console.error("Logout error:", error);
  };

  const onSettled = () => {
    console.log("Logout settled");
  };

  return useMutation(logoutMutationOptions({ onSuccess, onError, onSettled }));
}
