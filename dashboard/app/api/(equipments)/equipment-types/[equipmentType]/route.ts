import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentManufacturersCollection,
  equipmentModelsCollection,
  equipmentTypeManufacturersCollection,
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
 * /api/equipment-types/{equipmentType}:
 *   get:
 *     summary: Get an equipment type with its linked manufacturers and their supported models
 *     tags: [Equipment Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment type object with nested manufacturers and their models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 label:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 supported:
 *                   type: boolean
 *                 manufacturers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       label:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       supported:
 *                         type: boolean
 *                       models:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             label:
 *                               type: string
 *                             slug:
 *                               type: string
 *                             supported:
 *                               type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment type not found
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]",
  async (
    req: NextRequest,
    { params }: { params: { equipmentType: string } },
  ) => {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

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
    const equipmentType = {
      id: typesnapshot.id,
      ...typesnapshot.data(),
    } as EquipmentMetadata;

    const junctionSnap = await getDocs(
      query(
        collection(db, equipmentTypeManufacturersCollection),
        where("type_id", "==", equipmentTypeId),
      ),
    );

    if (junctionSnap.empty) {
      return NextResponse.json({ ...equipmentType, manufacturers: [] });
    }

    const manufacturerIds = junctionSnap.docs.map(
      (d) => d.data().manufacturer_id as string,
    );

    const chunks: string[][] = [];
    for (let i = 0; i < manufacturerIds.length; i += 30) {
      chunks.push(manufacturerIds.slice(i, i + 30));
    }

    const manufacturerDocs = (
      await Promise.all(
        chunks.map((chunk) =>
          getDocs(
            query(
              collection(db, equipmentManufacturersCollection),
              where("__name__", "in", chunk),
              where("supported", "==", true),
            ),
          ),
        ),
      )
    ).flatMap((snap) =>
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EquipmentMetadata),
    );

    const manufacturers = await Promise.all(
      manufacturerDocs.map(async (manufacturer) => {
        const junctionKey = `${manufacturer.id}__${equipmentTypeId}`;
        const modelsSnap = await getDocs(
          query(
            collection(
              db,
              equipmentTypeManufacturersCollection,
              junctionKey,
              equipmentModelsCollection,
            ),
            where("supported", "==", true),
          ),
        );
        const models = modelsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as EquipmentMetadata,
        );
        return { ...manufacturer, models };
      }),
    );

    return NextResponse.json({ ...equipmentType, manufacturers });
  },
  "Error fetching equipment type",
);
