import { withApiErrorHandling } from "@/lib/api-errors";
import type { InspectionResult } from "@/lib/network/forms.shared";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/inspections/mono:
 *   post:
 *     summary: Run AI defect detection on a single equipment image
 *     tags: [AI/ML Inspections (Integrations)]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [equipment_type, manufacturer, model, section, component, image]
 *             properties:
 *               equipment_type:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               section:
 *                 type: string
 *               component:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Defect detection result for the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment_type:
 *                   type: string
 *                 manufacturer:
 *                   type: string
 *                 model:
 *                   type: string
 *                 section:
 *                   type: string
 *                 component:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 defect_present:
 *                   type: boolean
 *                 defect_type:
 *                   type: string
 *                 severity:
 *                   type: number
 *                 observations:
 *                   type: string
 *                 recommended_action:
 *                   type: string
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Internal server error
 */
export const POST = withApiErrorHandling(
  "POST /api/inspections/mono",
  async (req: NextRequest) => {
    const incoming = await req.formData();

    const equipment_type = incoming.get("equipment_type");
    const manufacturer = incoming.get("manufacturer");
    const model = incoming.get("model");
    const section = incoming.get("section");
    const component = incoming.get("component");
    const image = incoming.get("image");

    if (
      !equipment_type ||
      !manufacturer ||
      !model ||
      !section ||
      !component ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const formData = new FormData();
    formData.append("equipment_type", equipment_type as string);
    formData.append("manufacturer", manufacturer as string);
    formData.append("model", model as string);
    formData.append("section", section as string);
    formData.append("component", component as string);
    formData.append("image", image as Blob);

    // Check if the request was successful (status in the 2xx range)
    const url = `${process.env.NEXT_PUBLIC_DEFECT_DETECTION_URL}/inspect`;
    const response = await fetch(url, { method: "POST", body: formData });

    if (!response.ok) {
      if ([400, 422].includes(response.status)) {
        // Validation Error
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

    const result: InspectionResult = await response.json();
    delete result.image_base64;
    return NextResponse.json(result);
  },
  "Error running defect detection",
);
