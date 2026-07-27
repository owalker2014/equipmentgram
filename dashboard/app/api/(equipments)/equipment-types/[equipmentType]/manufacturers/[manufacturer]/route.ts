import { requireAuth } from "@/lib/api-auth";
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
 * /api/equipment-types/{equipmentType}/manufacturers/{manufacturer}:
 *   get:
 *     summary: Get a manufacturer with the specified equipment type and its supported models
 *     tags: [Equipment Manufacturers]
 *     security:
 *       - bearerAuth: []
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
 *         description: Manufacturer with the scoped equipment type and its models
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
 *                 equipmentType:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     supported:
 *                       type: boolean
 *                 models:
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment type or manufacturer not found
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { equipmentType: string; manufacturer: string } },
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { equipmentType: equipmentTypeId, manufacturer: manufacturerId } =
    params;

  const [typeSnap, manufacturerSnap] = await Promise.all([
    getDoc(doc(db, equipmentTypesCollection, equipmentTypeId)),
    getDoc(doc(db, equipmentManufacturersCollection, manufacturerId)),
  ]);

  if (!typeSnap.exists()) {
    return NextResponse.json(
      { error: "Equipment type not found" },
      { status: 404 },
    );
  }

  if (!manufacturerSnap.exists()) {
    return NextResponse.json(
      { error: "Manufacturer not found" },
      { status: 404 },
    );
  }

  const equipmentType = {
    id: typeSnap.id,
    ...typeSnap.data(),
  } as EquipmentMetadata;

  const manufacturer = {
    id: manufacturerSnap.id,
    ...manufacturerSnap.data(),
  } as EquipmentMetadata;

  const junctionKey = `${manufacturerId}__${equipmentTypeId}`;
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

  return NextResponse.json({ ...manufacturer, equipmentType, models });
}
