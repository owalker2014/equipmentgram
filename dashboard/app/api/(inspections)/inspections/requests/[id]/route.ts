import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import { inspectionRequestsCollection } from "@/lib/network/inspection-requests.shared";
import { usersCollection } from "@/lib/network/users.shared";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { inspectorId, ...rest } = body;

  const update: Record<string, unknown> = { ...rest };

  if (inspectorId) {
    update.inspectorRef = doc(db, usersCollection, inspectorId);
  }

  await updateDoc(doc(db, inspectionRequestsCollection, params.id), update);
  return NextResponse.json({ success: true });
}
