import { useMutation } from "@tanstack/react-query";
import { changePasswordMutationOptions } from "./account.keys";

export function useChangePasswordMutation() {
  return useMutation(
    changePasswordMutationOptions({
      onSuccess: () => {},
      onError: () => {},
      onSettled: () => {},
    }),
  );
}
