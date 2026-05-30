import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  inspectionFormsCollection,
  InspectionFormWithId,
  InspectionReportStatus,
} from "@/lib/network/forms.shared";
import { inspectionRequestsCollection } from "@/lib/network/inspection-requests";
import { usersCollection, UserWithId } from "@/lib/network/users";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const userId = req.nextUrl.searchParams.get("userId");
  const equipmentType = req.nextUrl.searchParams.get("equipmentType");
  const isCustomer = req.nextUrl.searchParams.get("isCustomer") === "true";

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const conditions: QueryConstraint[] = [];
  if (equipmentType) {
    conditions.push(where("type", "==", equipmentType));
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
    new Set(snapshot.docs.map((doc) => doc.data().createdByUserUid as string)),
  );

  const userMap = new Map<string, unknown>();
  if (createdByUserUids.length > 0) {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("user_id", "in", createdByUserUids)),
    );

    // Create a map of users by UID for efficient lookup
    userSnapshot.forEach((userDoc) => {
      const data = userDoc.data();
      userMap.set(data.user_id, data);
    });
  }

  const inspectionForms = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdByUser: (userMap.get(data.createdByUserUid) ?? null) as UserWithId,
      userRef: data.userRef,
      requestedByUserRef: data.requestedByUserRef,
      inspectionRequestRef: data.inspectionRequestRef,
    } as unknown as InspectionFormWithId;
  });

  return NextResponse.json(inspectionForms);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { inspectionRequestId, userId, ...inspectionForm } = body;

  let docRef;
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
        throw new Error("Inspection request not found");
      }

      const requestedByUserId: string = snapshot.data().user_id;
      const requestedByUserRef = doc(db, usersCollection, requestedByUserId);

      transaction.update(inspectionRequestRef, {
        reportStatus: InspectionReportStatus.FilledForm,
      });

      await addDoc(collection(db, inspectionFormsCollection), {
        ...inspectionForm,
        inspectionRequestRef: inspectionRequestRef,
        userRef, // inspector
        reportStatus: InspectionReportStatus.FilledForm,
        requestedByUserRef,
        requestedByUserId,
      });
    });
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

  return NextResponse.json({ success: true, id: docRef?.id });
}
