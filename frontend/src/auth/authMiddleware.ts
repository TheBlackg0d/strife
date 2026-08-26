import { redirect, type MiddlewareFunction } from "react-router";
import { ensureUser } from "./session";
import { userContext } from "./context";
import axios from "axios";
import { getAccessToken } from "./tokenStore";

export const authMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  try {
    const user = await ensureUser();
    context.set(userContext, user);
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    if (status === 401 || status === 403) {
      const wanted = new URL(request.url).pathname;
      throw redirect(`/login?wanted=${encodeURIComponent(wanted)}`);
    }

    throw error;
  }
};

export const loggedInMiddleware: MiddlewareFunction = async () => {
  if (getAccessToken()) {
    throw redirect("/");
  }
};
