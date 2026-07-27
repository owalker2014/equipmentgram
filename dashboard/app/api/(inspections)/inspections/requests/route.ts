import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import { InspectionReportStatus } from "@/lib/network/forms.shared";
import {
  InspectionRequestObjectWithId,
  inspectionRequestsCollection,
} from "@/lib/network/inspection-requests.shared";
import { usersCollection } from "@/lib/network/users.shared";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections/requests:
 *   get:
 *     summary: List inspection requests, filtered by customer or inspector
 *     tags: [Inspection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Returns non-canceled requests for this customer
 *       - in: query
 *         name: inspectorId
 *         schema:
 *           type: string
 *         description: Inspector ID — must be combined with equipmentType
 *       - in: query
 *         name: equipmentType
 *         schema:
 *           type: string
 *         description: Filter pending requests by equipment type for an inspector
 *     responses:
 *       200:
 *         description: Array of inspection requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create an inspection request
 *     tags: [Inspection Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectorId:
 *                 type: string
 *                 description: If provided, links the request to an inspector
 *     responses:
 *       200:
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
export const GET = withApiErrorHandling(
  "GET /api/inspections/requests",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userId = req.nextUrl.searchParams.get("userId");
    const inspectorId = req.nextUrl.searchParams.get("inspectorId");
    const equipmentType = req.nextUrl.searchParams.get("equipmentType");

    const ref = collection(db, inspectionRequestsCollection);
    let q = query(ref);

    if (userId) {
      q = query(
        ref,
        where("user_id", "==", userId),
        where("canceled", "==", false),
      );
    } else if (inspectorId && equipmentType) {
      const inspectorRef = doc(db, usersCollection, inspectorId);
      q = query(
        ref,
        where("inspectorRef", "==", inspectorRef),
        where("equipmentType", "==", equipmentType),
        where("reportStatus", "==", InspectionReportStatus.Pending),
      );
    }

    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as InspectionRequestObjectWithId,
    );
    return NextResponse.json(requests);
  },
  "Error fetching inspection requests",
);

export const POST = withApiErrorHandling(
  "POST /api/inspections/requests",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { inspectorId, ...rest } = body;

    const inspectionRequest: Record<string, unknown> = {
      ...rest,
      created: serverTimestamp(),
    };

    if (inspectorId) {
      inspectionRequest.inspectorRef = doc(db, usersCollection, inspectorId);
    }

    const docRef = await addDoc(
      collection(db, inspectionRequestsCollection),
      inspectionRequest,
    );
    return NextResponse.json({ id: docRef.id });
  },
  "Error creating inspection request",
);
