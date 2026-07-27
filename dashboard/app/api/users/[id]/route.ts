import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import { usersCollection } from "@/lib/network/users.shared";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
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
 *         description: User object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: User updated
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
export const GET = withApiErrorHandling(
  "GET /api/users/[id]",
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const snapshot = await getDoc(doc(db, usersCollection, params.id));
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
  },
  "Error fetching user",
);

export const PATCH = withApiErrorHandling(
  "PATCH /api/users/[id]",
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const user = await req.json();
    await updateDoc(doc(db, usersCollection, params.id), user);
    return NextResponse.json({ success: true });
  },
  "Error updating user",
);
