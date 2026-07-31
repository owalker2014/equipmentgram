import { NextResponse } from "next/server";

const FETCH_TIMEOUT_MS = 25_000;

// POSTs formData to the external defect-detection service, aborting after
// FETCH_TIMEOUT_MS instead of hanging until the platform kills the function.
export async function callDefectDetectionService(
  path: string,
  formData: FormData,
): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_DEFECT_DETECTION_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw {
        statusCode: 504,
        message:
          "Defect detection service timed out. Please check your connection and try again.",
      };
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// Maps a non-ok defect-detection response to a client-facing error
// response, or returns null if the response was ok.
export async function defectDetectionErrorResponse(
  response: Response,
): Promise<NextResponse | null> {
  if (response.ok) {
    return null;
  }

  if ([400, 422].includes(response.status)) {
    const validationErrors: { detail: string } = await response.json();
    return NextResponse.json(
      { error: validationErrors?.detail ?? "Unknown Error" },
      { status: response.status },
    );
  }

  return NextResponse.json(
    { error: `HTTP error! status: ${response.status}` },
    { status: response.status },
  );
}
