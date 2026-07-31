import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  equipmentManufacturersCollection,
  equipmentModelsCollection,
  equipmentSectionQuestionsCollection,
  equipmentSectionsCollection,
  equipmentTypesCollection,
} from "@/lib/network/equipment.shared";
import {
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
 * /api/equipment-types/{equipmentType}/sections:
 *   get:
 *     summary: List sections and their questions/photo-requirements for an equipment type,
 *              optionally enriched with manufacturer and model metadata
 *     tags: [Equipment Sections]
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: Manufacturer document ID — included in the response when enriched=true
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Model document ID — included in the response when enriched=true
 *       - in: query
 *         name: enriched
 *         schema:
 *           type: boolean
 *         description: When true, fetches and embeds manufacturer and model objects alongside the sections
 *     responses:
 *       200:
 *         description: Equipment type, optional manufacturer/model metadata, and the sections array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipmentType:
 *                   type: object
 *                 manufacturer:
 *                   type: object
 *                   nullable: true
 *                 model:
 *                   type: object
 *                   nullable: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       questions:
 *                         type: array
 *                         items:
 *                           type: object
 *       404:
 *         description: Equipment type not found
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]/sections",
  async (
    req: NextRequest,
    { params }: { params: { equipmentType: string } },
  ) => {
    const auth = await requireAuth(req, { scopes: ["equipment-catalog"] });
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = req.nextUrl;
    const manufacturerId = searchParams.get("manufacturer");
    const modelId = searchParams.get("model");
    const isEnriched = searchParams.get("enriched") === "true";

    const { equipmentType: equipmentTypeId } = params;

    const typesnapshot = await getDoc(
      doc(db, equipmentTypesCollection, equipmentTypeId),
    );
    if (!typesnapshot.exists()) {
      return NextResponse.json(
        { error: "Equipment type not found" },
        { status: 404 },
      );
    }
    const equipmentType = typesnapshot.data();

    let manufacturer;
    let model;
    if (isEnriched) {
      if (manufacturerId) {
        const manufacturersnapshot = await getDoc(
          doc(db, equipmentManufacturersCollection, manufacturerId),
        );
        if (manufacturersnapshot.exists()) {
          manufacturer = manufacturersnapshot.data();
        }
      }

      if (modelId) {
        const modelsnapshot = await getDoc(
          doc(db, equipmentModelsCollection, modelId),
        );
        if (modelsnapshot.exists()) {
          model = modelsnapshot.data();
        }
      }
    }

    const ref = collection(db, equipmentSectionsCollection);
    const snapshot = await getDocs(
      query(ref, where("type_id", "==", equipmentTypeId)),
    );

    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const sections = await Promise.all(
      snapshot.docs.map(async (sectionDoc) => {
        const questionsRef = collection(
          sectionDoc.ref,
          equipmentSectionQuestionsCollection,
        );
        const questionsSnapshot = await getDocs(questionsRef);
        const questions = questionsSnapshot.docs.map((q) => ({
          id: q.id,
          ...q.data(),
        }));
        return { id: sectionDoc.id, ...sectionDoc.data(), questions };
      }),
    );

    return NextResponse.json({
      equipmentType,
      manufacturer,
      model,
      data: sections,
    });
  },
  "Error fetching equipment sections",
);
