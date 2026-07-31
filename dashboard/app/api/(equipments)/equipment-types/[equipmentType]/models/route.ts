import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentModelsCollection,
  equipmentTypeManufacturersCollection,
} from "@/lib/network/equipment.shared";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/equipment-types/{equipmentType}/models:
 *   get:
 *     summary: List all models for an equipment type, regardless of manufacturer
 *     tags: [Equipment Models]
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment type with its models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipmentType:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]/models",
  async (
    req: NextRequest,
    { params }: { params: { equipmentType: string } },
  ) => {
    const auth = await requireAuth(req, { scopes: ["equipment-catalog"] });
    if (auth instanceof NextResponse) return auth;

    const { equipmentType: equipmentTypeOrId } = params;

    const junctionRef = collection(db, equipmentTypeManufacturersCollection);
    const junctionSnapshot = await getDocs(
      query(junctionRef, where("type_id", "==", equipmentTypeOrId)),
    );

    if (!junctionSnapshot.empty) {
      const allModels = (
        await Promise.all(
          junctionSnapshot.docs.map((junctionDoc) => {
            const modelsRef = collection(
              db,
              equipmentTypeManufacturersCollection,
              junctionDoc.id,
              equipmentModelsCollection,
            );
            return getDocs(query(modelsRef, where("supported", "==", true)));
          }),
        )
      ).flatMap((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as EquipmentMetadata,
        ),
      );

      const seen = new Set<string>();
      const models = allModels.filter((m) => {
        if (seen.has(m.id!)) return false;
        seen.add(m.id!);
        return true;
      });

      return NextResponse.json(models);
    }

    // const equipmentData =
    //   (equipmentsInScope as any)?.[
    //     <EquipmentType>decodeURIComponent(equipmentTypeOrId)
    //   ] || {};

    // const allModelNames = Object.values(equipmentData).flatMap(
    //   (manufacturerData: any) => manufacturerData?.models || [],
    // );
    // const models = Array.from(new Set<string>(allModelNames)).map(
    //   (o: string) => ({
    //     id: o,
    //     label: o,
    //     slug: o.toLowerCase(),
    //   }),
    // );
    // const models = Array.from({ length: 1 }, (v, k) => ({ [`model-${k}`]: v }));

    return NextResponse.json([]);
  },
  "Error fetching equipment-type models",
);
