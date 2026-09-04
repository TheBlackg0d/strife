import { redirect, type MiddlewareFunction } from "react-router";
import { userContext } from "./context";
import type { Profile } from "../types/profile";
import { profileApi } from "../services/profile-api";
import { store } from "../store/store";

export const authMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  try {
    const profile = await loadUser();
    context.set(userContext, profile);
  } catch (error) {
    const status = httpStatusOf(error);

    if (status === 401 || status === 403) {
      const wanted = new URL(request.url).pathname;
      throw redirect(`/login?wanted=${encodeURIComponent(wanted)}`);
    }

    throw error;
  }
};

function httpStatusOf(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

async function loadUser(): Promise<Profile> {
  const cachedProfile = profileApi.endpoints.getProfile.select()(
    store.getState(),
  ).data;

  if (cachedProfile) {
    return cachedProfile;
  }

  return store.dispatch(profileApi.endpoints.getProfile.initiate()).unwrap();
}

export const loggedInMiddleware: MiddlewareFunction = async () => {
  const state = store.getState();
  if (state.auth.accessToken !== null) {
    throw redirect("/");
  }
};
