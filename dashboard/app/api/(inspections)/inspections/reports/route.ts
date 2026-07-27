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

/**
 * @swagger
 * /api/inspections/reports:
 *   get:
 *     summary: List sent inspection reports, optionally filtered by equipment type
 *     tags: [Inspection Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: equipmentType
 *         schema:
 *           type: string
 *         description: Filter reports by equipment type
 *     responses:
 *       200:
 *         description: Array of sent reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   inspectionFormId:
 *                     type: string
 *                   type:
 *                     type: string
 *                   sentTo:
 *                     type: string
 *                   createdByUserUid:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Record a sent report and notify the recipient
 *     tags: [Inspection Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sentReport, senderName, senderEmail]
 *             properties:
 *               sentReport:
 *                 type: object
 *               senderName:
 *                 type: string
 *               senderEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report recorded and notification sent
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
