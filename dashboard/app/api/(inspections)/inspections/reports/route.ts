import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentTypesCollection,
} from "@/lib/network/equipment.shared";
import {
  notificationsCollection,
  NotificationType,
} from "@/lib/network/notification.shared";
import {
  SentReport,
  sentReportsCollection,
} from "@/lib/network/sent-reports.shared";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const equipmentTypeId = req.nextUrl.searchParams.get("equipmentType");

  let equipmentTypeLabel: string | undefined;
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
    equipmentTypeLabel = (typesnapshot.data() as EquipmentMetadata).label;
  }

  const ref = collection(db, sentReportsCollection);
  const q = equipmentTypeLabel
    ? query(ref, where("type", "==", equipmentTypeLabel))
    : query(ref);

  const snapshot = await getDocs(q);
  const reports = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      type: data.type,
      form: data.form,
      sentTo: data.sentTo,
      createdByUserUid: data.createdByUserUid,
      createdByUser: data.createdByUser,
      id: data.inspectionFormId,
      inspectionFormId: data.inspectionFormId,
    } as SentReport;
  });

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { sentReport, senderName, senderEmail } = await req.json();

  await Promise.all([
    addDoc(collection(db, notificationsCollection), {
      message: `${senderName} has sent you a report`,
      type: NotificationType.Report,
      from: senderEmail,
      to: sentReport.sentTo,
    }),
    addDoc(collection(db, sentReportsCollection), sentReport),
  ]);

  return NextResponse.json({ success: true });
}
