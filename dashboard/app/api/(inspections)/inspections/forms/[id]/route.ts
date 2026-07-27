import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  inspectionFormsCollection,
  InspectionFormWithId,
} from "@/lib/network/forms.shared";
import { usersCollection, UserWithId } from "@/lib/network/users.shared";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections/forms/{id}:
 *   get:
 *     summary: Get a single inspection form by ID, including creator info
 *     tags: [Inspection Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inspection form with creator user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inspection form not found
 */
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
