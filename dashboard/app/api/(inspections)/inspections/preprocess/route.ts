import { withApiErrorHandling } from "@/lib/api-errors";
import admin, { getDownloadURL } from "@/lib/firebaseConfig/init-admin";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * @swagger
 * /api/inspections/preprocess:
 *   post:
 *     summary: Upload an equipment image to Firebase Storage and return its download URL
 *     description: >
 *       Validates the file size, uploads it to Firebase Storage, and returns a signed
 *       download URL. HEIC/HEIF files must be converted to JPEG by the caller before
 *       sending, as conversion requires a browser-side library (heic2any).
 *     tags: [AI/ML Inspections (Integrations)]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, fileName]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (max 5MB, HEIC must be pre-converted)
 *               fileName:
 *                 type: string
 *                 description: Base name used as the storage path prefix
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 downloadURL:
 *                   type: string
 *                   description: Signed Firebase Storage download URL
 *       400:
 *         description: Missing required fields or file exceeds 5MB limit
 *       500:
 *         description: Internal server error
 */
export const POST = withApiErrorHandling(
  "POST /api/inspections/preprocess",
  async (req: NextRequest) => {
    const incoming = await req.formData();

    const file = incoming.get("file") as File | null;
    const fileName = incoming.get("fileName") as string | null;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be ${MAX_FILE_SIZE_MB}MB or less` },
        { status: 400 },
      );
    }

    const storagePath = `${fileName}-${Date.now()}-${file.name.replace(/ /g, "-")}`;
    const bucket = admin
      .storage()
      .bucket(process.env.NEXT_PUBLIC_storageBucket);
    const fileRef = bucket.file(storagePath);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileRef.save(buffer, { metadata: { contentType: file.type } });
    const downloadURL = await getDownloadURL(fileRef);

    return NextResponse.json({ downloadURL });
  },
  "Error uploading component image",
);
