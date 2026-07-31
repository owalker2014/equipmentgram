import { NextResponse } from "next/server";
import { getSwaggerDocsCustomToken } from "@/lib/firebaseConfig/getSwaggerDocsCustomToken";

// Lets the Swagger UI on /api-docs authenticate itself so browsing/trying
// the docs doesn't require a signed-in dashboard session. Safe in every
// environment: the resulting token is scoped to "swagger-docs" only and
// cannot pass requireAuth() on any of dashboard's real business routes.
export const GET = async () => {
  const token = await getSwaggerDocsCustomToken();
  return NextResponse.json({ token });
};
