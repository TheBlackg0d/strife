import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient();
}
let queryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  return (queryClient ??= makeQueryClient());
}
