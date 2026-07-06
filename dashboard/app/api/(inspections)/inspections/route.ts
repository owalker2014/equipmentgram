import type { InspectionResultBatch } from "@/lib/network/forms.shared";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections:
 *   post:
 *     summary: Run AI defect detection on equipment images (batch)
 *     tags: [AI/ML Inspections (Integrations)]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [equipment_type, manufacturer, model, section, components, images]
 *             properties:
 *               equipment_type:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               section:
 *                 type: string
 *               components:
 *                 type: string
 *                 description: JSON-encoded component names
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Batch defect detection results
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();

    const equipmentType = incoming.get("equipment_type");
    const manufacturer = incoming.get("manufacturer");
    const model = incoming.get("model");
    const section = incoming.get("section");
    const components = incoming.get("components");
    const images = incoming.getAll("images");

    if (
      !equipmentType ||
      !manufacturer ||
      !model ||
      !section ||
      !components ||
      !images.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const formData = new FormData();
    formData.append("equipment_type", equipmentType as string);
    formData.append("manufacturer", manufacturer as string);
    formData.append("model", model as string);
    formData.append("section", section as string);
    formData.append("component_names", components as string);
    images.forEach((image) => formData.append("images", image as Blob));

    const url = `${process.env.NEXT_PUBLIC_DEFECT_DETECTION_URL}/inspect/batch`;
    const response = await fetch(url, { method: "POST", body: formData });

    if (!response.ok) {
      if ([400, 422].includes(response.status)) {
        const validationErrors: { detail: string } = await response.json();
        return NextResponse.json(
          { error: validationErrors?.detail ?? "Unknown Error" },
          { status: response.status },
        );
      }
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status },
      );
    }

    const result: InspectionResultBatch = await response.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
