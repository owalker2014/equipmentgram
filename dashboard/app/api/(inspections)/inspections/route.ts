import { withApiErrorHandling } from "@/lib/api-errors";
import {
  callDefectDetectionService,
  defectDetectionErrorResponse,
} from "@/lib/defect-detection-client";
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
export const POST = withApiErrorHandling(
  "POST /api/inspections",
  async (req: NextRequest) => {
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

    const response = await callDefectDetectionService(
      "/inspect/batch",
      formData,
    );
    const errorResponse = await defectDetectionErrorResponse(response);
    if (errorResponse) {
      return errorResponse;
    }

    const result: InspectionResultBatch = await response.json();
    return NextResponse.json(result);
  },
  "Error running batch defect detection",
);
