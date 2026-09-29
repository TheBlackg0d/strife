import { mutationOptions } from "@tanstack/react-query";
import type { ChangeAccountPasswordMutationFunc } from "./account.types";
import { changePassword } from "./account.requests";
import type { PasswordFormValues } from "~/shared/settings/components/password.schema";

export enum AccountKeys {
  ACCOUNT = "ACCOUNT",
}

export const changePasswordMutationOptions = (
  callback: ChangeAccountPasswordMutationFunc,
) =>
  mutationOptions({
    mutationFn: (changePasswordFormValues: PasswordFormValues) =>
      changePassword(changePasswordFormValues),
    onSuccess: callback.onSuccess,
    onError: callback.onError,
    onSettled: callback.onSettled,
  });
