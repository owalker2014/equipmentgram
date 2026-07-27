// import { requireAuth } from "@/lib/api-auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentModelsCollection,
  equipmentTypeManufacturersCollection,
} from "@/lib/network/equipment.shared";
// import {
//   EquipmentManufacturer,
//   equipmentsInScope,
//   EquipmentType,
// } from "@/utils/formUtils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/equipment-types/{equipmentType}/manufacturers/{manufacturer}/models:
 *   get:
 *     summary: List models for a specific manufacturer and equipment type combination
 *     tags: [Equipment Models]
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: manufacturer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   label:
 *                     type: string
 *                   slug:
 *                     type: string
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]/manufacturers/[manufacturer]/models",
  async (
    _req: NextRequest,
    { params }: { params: { equipmentType: string; manufacturer: string } },
  ) => {
    // const auth = await requireAuth(req);
    // if (auth instanceof NextResponse) return auth;

    const {
      equipmentType: equipmentTypeOrId,
      manufacturer: manufacturerOrId,
    } = params;

    const junctionKey = `${manufacturerOrId}__${equipmentTypeOrId}`; // very important
    const ref = collection(
      db,
      equipmentTypeManufacturersCollection,
      junctionKey,
      equipmentModelsCollection,
    );
    const snapshot = await getDocs(query(ref, where("supported", "==", true)));

    if (!snapshot.empty) {
      const models = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as EquipmentMetadata,
      );
      return NextResponse.json(models);
    }

    // const model = req.nextUrl.searchParams.get("model");
    // const models = await getModels(equipmentType)
    // const models = (
    //   (equipmentsInScope as any)?.[
    //     <EquipmentType>decodeURIComponent(equipmentTypeOrId)
    //   ]?.[<EquipmentManufacturer>decodeURIComponent(manufacturerOrId)]?.models ||
    //   []
    // ).map((o: any) => ({
    //   id: o,
    //   label: o,
    //   slug: o.toLowerCase(),
    // }));

    return NextResponse.json([]);
  },
  "Error fetching manufacturer models",
);
