import { isRouteErrorResponse } from "react-router";

export interface ErrorDetails {
  status?: number;
  title: string;
  message: string;
  detail?: string;
}

const GENERIC: Omit<ErrorDetails, "status"> = {
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again.",
};

const STATUS_COPY: Record<number, Omit<ErrorDetails, "status">> = {
  400: {
    title: "Bad request",
    message: "The request could not be understood. Please try again.",
  },
  401: {
    title: "You're not signed in",
    message: "Log in again to pick up where you left off.",
  },
  403: {
    title: "Access denied",
    message: "You don't have permission to view this page.",
  },
  404: {
    title: "Page not found",
    message: "This page doesn't exist, or it moved somewhere else.",
  },
  408: {
    title: "Request timed out",
    message: "The server took too long to answer. Please try again.",
  },
  429: {
    title: "Too many requests",
    message: "Slow down for a moment, then try again.",
  },
  500: {
    title: "Server error",
    message: "Something broke on our side. We're on it.",
  },
  503: {
    title: "Service unavailable",
    message: "Strife is temporarily unreachable. Try again in a moment.",
  },
};

function copyForStatus(status: number): Omit<ErrorDetails, "status"> {
  if (STATUS_COPY[status]) return STATUS_COPY[status];
  if (status >= 500) return STATUS_COPY[500];
  if (status >= 400) return GENERIC;
  return GENERIC;
}

/** Turns anything thrown by a route, a loader or a query into displayable copy. */
export function toErrorDetails(error: unknown): ErrorDetails {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      ...copyForStatus(error.status),
      detail: asString(error.data) ?? error.statusText,
    };
  }

  if (error instanceof Error) {
    return { ...GENERIC, detail: error.stack ?? error.message };
  }

  // RTK Query / axios-ish rejections: { status, data: { message } }
  if (isRecord(error)) {
    const status = typeof error.status === "number" ? error.status : undefined;
    const message =
      asString(error.message) ??
      (isRecord(error.data) ? asString(error.data.message) : undefined);

    return {
      status,
      ...(status !== undefined ? copyForStatus(status) : GENERIC),
      detail: message,
    };
  }

  return { ...GENERIC, detail: asString(error) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
