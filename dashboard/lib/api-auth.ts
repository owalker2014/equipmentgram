import admin from "@/lib/firebaseConfig/init-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(
  req: NextRequest,
): Promise<DecodedIdToken | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const idToken = bearerToken ?? req.cookies.get("idToken")?.value;

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
