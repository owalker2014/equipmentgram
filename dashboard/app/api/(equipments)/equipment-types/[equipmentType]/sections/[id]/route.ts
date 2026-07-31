import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  equipmentSectionQuestionsCollection,
  equipmentSectionsCollection,
} from "@/lib/network/equipment.shared";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/equipment-types/{equipmentType}/sections/{id}:
 *   get:
 *     summary: Get a single equipment section with its questions/photo-requirements
 *     tags: [Equipment Sections]
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section object with nested questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Section not found
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]/sections/[id]",
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const auth = await requireAuth(req, { scopes: ["equipment-catalog"] });
    if (auth instanceof NextResponse) return auth;

    const { id } = params;

    const ref = doc(db, equipmentSectionsCollection, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const questionsRef = collection(ref, equipmentSectionQuestionsCollection);
    const questionsSnap = await getDocs(questionsRef);
    const questions = questionsSnap.docs.map((q) => ({ id: q.id, ...q.data() }));

    return NextResponse.json({
      id: snapshot.id,
      ...snapshot.data(),
      questions,
    });
  },
  "Error fetching equipment section",
);
