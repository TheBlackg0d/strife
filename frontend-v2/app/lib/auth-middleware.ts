import {
  createContext,
  redirect,
  type DataStrategyResult,
  type MiddlewareFunction,
} from "react-router";
import { getQueryClient } from "~/lib/query-client";
import { refreshTokenQuery } from "~/api/auth/auth.keys";
import type { Account } from "~/api/auth/auth.types";

type ClientMiddleware = MiddlewareFunction<Record<string, DataStrategyResult>>;

export const userContext = createContext<Account>();

async function getAuthenticatedAccount(): Promise<Account | null> {
  try {
    const { accessToken, ...account } = await getQueryClient().query({
      ...refreshTokenQuery(),
      staleTime: "static",
    });
    console.log("Fetched authenticated account:", account);
    return accessToken ? account : null;
  } catch {
    return null;
  }
}

export const authMiddleware: ClientMiddleware = async ({
  context,
  request,
}) => {
  const account = await getAuthenticatedAccount();
  if (!account) {
    getQueryClient().removeQueries({ queryKey: refreshTokenQuery().queryKey });
    const { pathname, search } = new URL(request.url);
    throw redirect(
      `/login?redirectTo=${encodeURIComponent(pathname + search)}`,
    );
  }
  context.set(userContext, account);
};

export const guestMiddleware: ClientMiddleware = async () => {
  if (await getAuthenticatedAccount()) {
    throw redirect("/dashboard");
  }
};
