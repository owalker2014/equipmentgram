import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentTypesCollection,
} from "@/lib/network/equipment.shared";
import {
  inspectionFormsCollection,
  InspectionFormWithId,
  InspectionReportStatus,
} from "@/lib/network/forms.shared";
import { inspectionRequestsCollection } from "@/lib/network/inspection-requests.shared";
import { usersCollection, UserWithId } from "@/lib/network/users.shared";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections/forms:
 *   get:
 *     summary: List inspection forms for a user
 *     tags: [Inspection Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: equipmentType
 *         schema:
 *           type: string
 *         description: Filter by equipment type
 *       - in: query
 *         name: isCustomer
 *         schema:
 *           type: boolean
 *         description: When true, returns only approved forms requested by this user
 *     responses:
 *       200:
 *         description: Array of inspection forms with creator info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: userId is required
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create an inspection form
 *     tags: [Inspection Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *               inspectionRequestId:
 *                 type: string
 *                 description: If provided, links this form to an existing inspection request
 *     responses:
 *       201:
 *         description: Form created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 id:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
export const GET = withApiErrorHandling(
  "GET /api/inspections/forms",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const userId = req.nextUrl.searchParams.get("userId");
    const equipmentTypeId = req.nextUrl.searchParams.get("equipmentType");
    const isCustomer = req.nextUrl.searchParams.get("isCustomer") === "true";

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const conditions: QueryConstraint[] = [];
    if (equipmentTypeId) {
      const typesnapshot = await getDoc(
        doc(db, equipmentTypesCollection, equipmentTypeId),
      );
      if (!typesnapshot.exists()) {
        return NextResponse.json(
          { error: "Equipment not found" },
          { status: 404 },
        );
      }

      const equipmentType = typesnapshot.data() as EquipmentMetadata;
      conditions.push(where("type", "==", equipmentType.label));
    }

    if (isCustomer) {
      conditions.push(
        ...[
          // approved form or all forms if customer
          where("reportStatus", "==", InspectionReportStatus.Approved),
          where("requestedByUserId", "==", userId),
        ],
      );
    } else {
      conditions.push(
        ...[
          where("reportStatus", "in", [
            InspectionReportStatus.Approved,
            InspectionReportStatus.FilledForm,
            InspectionReportStatus.Rejected,
            InspectionReportStatus.Pending,
          ]),
          where("createdByUserUid", "==", userId),
        ],
      );
    }

    // conditions.push(orderBy("timestamp", "desc"));
    const ref = collection(db, inspectionFormsCollection);
    const snapshot = await getDocs(query(ref, ...conditions));

    const createdByUserUids = Array.from(
      new Set(
        snapshot.docs.map((doc) => doc.data().createdByUserUid as string),
      ),
    );

    const userMap = new Map<string, unknown>();
    if (createdByUserUids.length > 0) {
      const usersnapshot = await getDocs(
        query(
          collection(db, usersCollection),
          where("user_id", "in", createdByUserUids),
        ),
      );

      // Create a map of users by UID for efficient lookup
      usersnapshot.forEach((userDoc) => {
        const data = userDoc.data();
        userMap.set(data.user_id, data);
      });
    }

    const inspectionForms = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdByUser: (userMap.get(data.createdByUserUid) ??
          null) as UserWithId,
        userRef: data.userRef,
        requestedByUserRef: data.requestedByUserRef,
        inspectionRequestRef: data.inspectionRequestRef,
      } as unknown as InspectionFormWithId;
    });

    return NextResponse.json(inspectionForms);
  },
  "Error fetching inspection forms",
);

export const POST = withApiErrorHandling(
  "POST /api/inspections/forms",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { inspectionRequestId, userId, ...inspectionForm } = body;

    let docRef;
    let notFound = false;
    const userRef = doc(db, usersCollection, userId);
    if (inspectionRequestId) {
      await runTransaction(db, async (transaction) => {
        const inspectionRequestRef = doc(
          db,
          inspectionRequestsCollection,
          inspectionRequestId,
        );

        const snapshot = await transaction.get(inspectionRequestRef);
        if (!snapshot.exists()) {
          notFound = true;
          return;
        }

        const requestedByUserId: string = snapshot.data().user_id;
        const requestedByUserRef = doc(db, usersCollection, requestedByUserId);

        transaction.update(inspectionRequestRef, {
          reportStatus: InspectionReportStatus.FilledForm,
        });

        docRef = await addDoc(collection(db, inspectionFormsCollection), {
          ...inspectionForm,
          inspectionRequestRef: inspectionRequestRef,
          userRef, // inspector
          reportStatus: InspectionReportStatus.FilledForm,
          requestedByUserRef,
          requestedByUserId,
        });
      });

      if (notFound) {
        return NextResponse.json(
          { error: "Inspection request not found" },
          { status: 404 },
        );
      }
    } else {
      docRef = await addDoc(collection(db, inspectionFormsCollection), {
        ...inspectionForm,
        ...(inspectionForm["batch_id"] && { id: inspectionForm["batch_id"] }),
        userRef, // inspector
        reportStatus: InspectionReportStatus.FilledForm,
        reportID: crypto.randomUUID(),
        timestamp: serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true, id: docRef?.id }, { status: 201 });
  },
  "Error creating inspection form",
);
