import { NextResponse } from "next/server";

interface CodedError {
  code: string;
  message: string;
}

interface StatusCodedError {
  statusCode: number;
  message: string;
}

function isCodedError(error: unknown): error is CodedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

function isStatusCodedError(error: unknown): error is StatusCodedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as { statusCode: unknown }).statusCode === "number"
  );
}

// Firestore/Auth/Storage error codes (e.g. "permission-denied",
// "auth/id-token-expired", "storage/object-not-found") mapped to HTTP status.
const FIREBASE_STATUS_MAP: Record<string, number> = {
  "invalid-argument": 400,
  "out-of-range": 400,
  unauthenticated: 401,
  "permission-denied": 403,
  "not-found": 404,
  "already-exists": 409,
  aborted: 409,
  "failed-precondition": 412,
  "resource-exhausted": 429,
  cancelled: 499,
  "deadline-exceeded": 504,
  unavailable: 503,
  unimplemented: 501,
  internal: 500,
  "data-loss": 500,
  unknown: 500,
};

function statusForFirebaseCode(code: string): number {
  const normalized = code.toLowerCase();
  const bareCode = normalized.includes("/")
    ? normalized.split("/")[1]
    : normalized;

  if (bareCode.includes("not-found") || bareCode.includes("not_found")) {
    return 404;
  }
  if (bareCode.includes("unauthorized") || bareCode.includes("permission")) {
    return 403;
  }
  if (
    bareCode.includes("unauthenticated") ||
    bareCode.includes("invalid-credential") ||
    bareCode.includes("expired")
  ) {
    return 401;
  }
  if (bareCode.includes("quota") || bareCode.includes("resource-exhausted")) {
    return 429;
  }

  return (
    FIREBASE_STATUS_MAP[normalized] ?? FIREBASE_STATUS_MAP[bareCode] ?? 500
  );
}

/**
 * Normalizes Firebase (Firestore/Auth/Storage), Stripe, and generic errors
 * into a consistent JSON error response, logging the original error server-side.
 */
export function handleApiError(
  error: unknown,
  context: string,
  message: string,
): NextResponse {
  if (isStatusCodedError(error)) {
    const status =
      error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : 500;
    console.error(`[${context}] Upstream error (${status}):`, error.message); // eslint-disable-line
    return NextResponse.json(
      {
        error:
          status >= 500
            ? "A server error occurred. Please try again later."
            : error.message,
        message,
      },
      { status },
    );
  }

  if (isCodedError(error)) {
    const status = statusForFirebaseCode(error.code);
    // eslint-disable-next-line
    console.error(
      `[${context}] Firebase error (${error.code}):`,
      error.message,
    );
    return NextResponse.json(
      {
        error:
          status === 500
            ? "A server error occurred. Please try again later."
            : error.message,
        code: error.code,
        message,
      },
      { status },
    );
  }

  console.error(`[${context}] Unexpected error:`, error); // eslint-disable-line
  return NextResponse.json(
    {
      error: "A server error occurred. Please try again later.",
      message,
    },
    { status: 500 },
  );
}

/**
 * Wraps a Next.js route handler so any thrown error (Firestore, Auth,
 * Storage, Stripe, or otherwise) is converted into a proper error response
 * instead of surfacing as an unhandled 500 with a leaked stack trace.
 */
export function withApiErrorHandling<Args extends unknown[]>(
  context: string,
  handler: (...args: Args) => Promise<NextResponse>,
  message?: string,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(
        error,
        context,
        message ?? "An unexpected error occurred",
      );
    }
  };
}
