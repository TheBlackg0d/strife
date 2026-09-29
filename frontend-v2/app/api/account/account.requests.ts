import type { PasswordFormValues } from "~/shared/settings/components/password.schema";
import { api } from "../api";

export async function changePassword(
  passwordFormValues: PasswordFormValues,
): Promise<void> {
  await api.post("/account/change-password", passwordFormValues);
}
