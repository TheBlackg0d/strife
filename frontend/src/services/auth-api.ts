import {
  type RegisterCredential,
  type AuthResponse,
  type LoginCredential,
} from "../auth/types/auth";
import { loggedOut, tokenReceived } from "../store/slices/auth-slice";
import { strifeApi, strifeAuthApi } from "./strife-api";

const authApi = strifeAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredential>({
      query: (loginCredidential) => ({
        url: "/auth/login",
        method: "POST",
        body: loginCredidential,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(tokenReceived(data));
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(loggedOut());
      },
    }),
    register: builder.mutation<AuthResponse, RegisterCredential>({
      query: (registerCredential) => ({
        url: "/auth/register",
        method: "POST",
        body: registerCredential,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(tokenReceived(data));

        dispatch(strifeApi.util.resetApiState());
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
