import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import { InspectionReportStatus } from "@/lib/network/forms.shared";
import {
  InspectionRequestObjectWithId,
  inspectionRequestsCollection,
} from "@/lib/network/inspection-requests";
import { usersCollection } from "@/lib/network/users";
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

export async function GET(req: NextRequest) {
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
}

export async function POST(req: NextRequest) {
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
}
