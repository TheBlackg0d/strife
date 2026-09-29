import type { InternalAxiosRequestConfig } from "axios";
import type { MutationFunc } from "~/shared/types";

export type Account = {
  id: string;
  username: string;
  email: string;
};

export type AuthResponse = Account & {
  accessToken: string;
};

export interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export type AuthMutation = MutationFunc<AuthResponse>;
export type LogoutMutation = MutationFunc<void>;

export type LoginDataForm = {
  email: string;
  password: string;
};

export type RegisterDataForm = {
  username: string;
  password: string;
  email: string;
  passwordConfirmation: string;
};
