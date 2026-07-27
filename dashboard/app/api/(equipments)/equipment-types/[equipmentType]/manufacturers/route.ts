import { withApiErrorHandling } from "@/lib/api-errors";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentTypesCollection,
  equipmentManufacturersCollection,
  equipmentTypeManufacturersCollection,
} from "@/lib/network/equipment.shared";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  // QueryConstraint,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/equipment-types/{equipmentType}/manufacturers:
 *   get:
 *     summary: List manufacturers for an equipment type
 *     tags: [Equipment Manufacturers]
 *     parameters:
 *       - in: path
 *         name: equipmentType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of manufacturers from Firestore, or an empty array if none are linked to this equipment type
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
 *                   supported:
 *                     type: boolean
 *       404:
 *         description: Equipment type not found
 */
export const GET = withApiErrorHandling(
  "GET /api/equipment-types/[equipmentType]/manufacturers",
  async (
    _req: NextRequest,
    { params }: { params: { equipmentType: string } },
  ) => {
    const { equipmentType: equipmentTypeId } = params;

    const typesnapshot = await getDoc(
      doc(db, equipmentTypesCollection, equipmentTypeId),
    );
    if (!typesnapshot.exists()) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 },
      );
    }

    // Step 1: query the junction collection for all associations with this equipmentType
    const junctionref = collection(db, equipmentTypeManufacturersCollection);
    const condition = where("type_id", "==", typesnapshot.id);
    const junctionsnapshot = await getDocs(query(junctionref, condition));

    if (!junctionsnapshot.empty) {
      // Step 2: collect all manufacturerIds
      const equipmentTypeManufacturerIds = junctionsnapshot.docs.map(
        (doc) => doc.data().manufacturer_id,
      );

      // Step 3: batch-fetch the manufacturers documents
      // Firestore `in` supports up to 30 values per query (as of SDK v9+)
      const chunks = [];
      for (let i = 0; i < equipmentTypeManufacturerIds.length; i += 30) {
        chunks.push(equipmentTypeManufacturerIds.slice(i, i + 30));
      }

      const ref = collection(db, equipmentManufacturersCollection);
      const manufacturers = (
        await Promise.all(
          chunks.map((chunk) =>
            getDocs(
              query(
                ref,
                ...[
                  where("__name__", "in", chunk), // query by document ID
                  where("supported", "==", true),
                ],
              ),
            ),
          ),
        )
      ).flatMap((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as EquipmentMetadata,
        ),
      );
      return NextResponse.json(manufacturers);
    }

    // const manufacturers = Array.from({ length: 1 }, (v, k) => ({
    //   [`manufacturer-${k}`]: v,
    // }));

    return NextResponse.json([]);
  },
  "Error fetching equipment manufacturers",
);
