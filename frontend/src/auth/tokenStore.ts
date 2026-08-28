import type { Account } from "./types/auth";

let accessToken: string | null = null;
let currentaccount: Account | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getAccount(): Account | null {
  return currentaccount;
}

export function setSession(token: string, account: Account): void {
  accessToken = token;
  currentaccount = account;
}

export function clearSession(): void {
  accessToken = null;
  currentaccount = null;
}
