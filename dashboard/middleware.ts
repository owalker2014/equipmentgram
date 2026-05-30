// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
// console.log("Allowed origins: ", allowedOrigins); // eslint-disable-line

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Check if the origin is allowed
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403, statusText: "Forbidden" });
  }

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  return response;
}

export const config = {
  matcher: "/api/:path*", // Only apply to API routes
};
