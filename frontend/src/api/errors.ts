import axios from "axios";

export type FieldErrors = Partial<Record<string, string>>;

export interface ApiError {
  message: string;
  fieldErrors: FieldErrors;
  status?: number;
}

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { message: GENERIC_MESSAGE, fieldErrors: {} };
  }

  if (!error.response) {
    return {
      message: "Unable to reach the server. Check your connection.",
      fieldErrors: {},
    };
  }

  const status = error.response.status;
  const data: unknown = error.response.data;

  if (isRecord(data)) {
    if ("fieldErrors" in data || "message" in data) {
      const fieldErrors = isRecord(data.fieldErrors)
        ? pickStrings(data.fieldErrors)
        : {};

      return {
        message: asString(data.message) ?? GENERIC_MESSAGE,
        fieldErrors,
        status,
      };
    }

    const fieldErrors = pickStrings(data);
    if (Object.keys(fieldErrors).length > 0) {
      return { message: "Please fix the errors below", fieldErrors, status };
    }
  }

  return { message: GENERIC_MESSAGE, fieldErrors: {}, status };
}

export function hasFieldErrors(error: ApiError | null): boolean {
  return error !== null && Object.keys(error.fieldErrors).length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function pickStrings(value: Record<string, unknown>): FieldErrors {
  const entries = Object.entries(value).filter(
    ([, message]) => typeof message === "string" && message.length > 0,
  );

  return Object.fromEntries(entries) as FieldErrors;
}
