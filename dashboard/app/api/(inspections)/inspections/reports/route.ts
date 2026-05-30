import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  notificationsCollection,
  NotificationType,
} from "@/lib/network/notification";
import { SentReport, sentReportsCollection } from "@/lib/network/sent-reports";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const equipmentType = req.nextUrl.searchParams.get("equipmentType");

  const ref = collection(db, sentReportsCollection);
  const q = equipmentType
    ? query(ref, where("type", "==", equipmentType))
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
