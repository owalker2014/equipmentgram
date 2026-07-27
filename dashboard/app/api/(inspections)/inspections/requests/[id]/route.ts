import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import { inspectionRequestsCollection } from "@/lib/network/inspection-requests.shared";
import { usersCollection } from "@/lib/network/users.shared";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections/requests/{id}:
 *   patch:
 *     summary: Update an inspection request by ID
 *     tags: [Inspection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectorId:
 *                 type: string
 *                 description: If provided, reassigns the request to this inspector
 *     responses:
 *       200:
 *         description: Request updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
export const PATCH = withApiErrorHandling(
  "PATCH /api/inspections/requests/[id]",
  async (req: NextRequest, { params }: { params: { id: string } }) => {
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
  },
  "Error updating inspection request",
);
