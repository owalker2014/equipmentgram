import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  inspectionFormsCollection,
  InspectionFormWithId,
} from "@/lib/network/forms.shared";
import { usersCollection, UserWithId } from "@/lib/network/users.shared";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const snapshot = await getDoc(doc(db, inspectionFormsCollection, params.id));

  if (!snapshot.exists()) {
    return NextResponse.json(
      { error: "Inspection form not found" },
      { status: 404 },
    );
  }

  const data = snapshot.data();
  const createdByUserUid: string = data.createdByUserUid;

  const usersnapshot = await getDoc(doc(db, usersCollection, createdByUserUid));
  const createdByUser = (
    usersnapshot.exists() ? usersnapshot.data() : null
  ) as UserWithId;

  return NextResponse.json({
    id: snapshot.id,
    ...data,
    createdByUser,
    userRef: undefined,
    requestedByUserRef: undefined,
    inspectionRequestRef: undefined,
  } as unknown as InspectionFormWithId);
}
