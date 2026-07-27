import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  Notification,
  notificationsCollection,
} from "@/lib/network/notification.shared";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: List notifications for a user by email
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: email is required
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notification created
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
  "GET /api/notifications",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const q = query(
      collection(db, notificationsCollection),
      where("to", "==", email),
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Notification),
    }));
    return NextResponse.json(notifications);
  },
  "Error fetching notifications",
);

export const POST = withApiErrorHandling(
  "POST /api/notifications",
  async (req: NextRequest) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const notification = await req.json();
    const docRef = await addDoc(
      collection(db, notificationsCollection),
      notification,
    );
    return NextResponse.json({ id: docRef.id });
  },
  "Error creating notification",
);
