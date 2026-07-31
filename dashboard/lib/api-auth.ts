import admin from "@/lib/firebaseConfig/init-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(
  req: NextRequest,
  opts?: { scopes?: string[] },
): Promise<DecodedIdToken | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const idToken = bearerToken ?? req.cookies.get("idToken")?.value;

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: DecodedIdToken;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Service identities (minted via createCustomToken with a
  // `role: "eqg-service"` claim) are scoped to whichever endpoints
  // explicitly opt in via `opts.scopes`. Real user tokens carry no `role`
  // claim and are unaffected.
  if (decoded.role === "eqg-service") {
    const tokenScopes: string[] = Array.isArray(decoded.scopes)
      ? decoded.scopes
      : [];

    const allowed =
      tokenScopes.includes("swagger-docs") || // for the /api/docs route itself
      opts?.scopes?.some((scope) => tokenScopes.includes(scope));

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return decoded;
}
