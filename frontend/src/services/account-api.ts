import type { Response } from "../types/generic";
import type { PasswordFormValues } from "../types/settings";
import { strifeApi } from "./strife-api";

const accountApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<Response, PasswordFormValues>({
      query: (passwordFormValues: PasswordFormValues) => ({
        url: "account/change-password",
        method: "POST",
        body: passwordFormValues,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = accountApi;
