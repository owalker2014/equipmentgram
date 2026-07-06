// import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import {
  EquipmentMetadata,
  equipmentTypesCollection,
} from "@/lib/network/equipment.shared";
// import { equipments } from "@/utils/equipment";
// import { equipmentsInScope } from "@/utils/formUtils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/equipment-types:
 *   get:
 *     summary: List all supported equipment types
 *     tags: [Equipment Types]
 *     responses:
 *       200:
 *         description: Array of supported equipment types
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
export async function GET(req: NextRequest) {
  // const auth = await requireAuth(req);
  // if (auth instanceof NextResponse) return auth;

  try {
    const ref = collection(db, equipmentTypesCollection);
    const snapshot = await getDocs(query(ref, where("supported", "==", true)));

    if (!snapshot.empty) {
      const equipmentTypes = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as EquipmentMetadata,
      );
      return NextResponse.json(equipmentTypes);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching equipments", details: error },
      { status: 500 },
    );
  }

  // const equipmentTypes = equipments
  //   .filter((o: any) => Object.keys(equipmentsInScope).includes(o.title))
  //   .map((o) => ({
  //     id: o.title,
  //     label: o.title,
  //     slug: o.title.toLowerCase(),
  //   }));
  return NextResponse.json([]);
}
