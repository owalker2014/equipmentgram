import InspectionFormEmail, {
  InspectionFormEmailProps,
} from "@/components/emails/InspectionFormEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const maxDuration = 60;
const resend = new Resend(process.env.RESEND_API_KEY);

// Resend caps total email size at 40 MB (after base64). Leave headroom for the HTML body.
// const MAX_BASE64_CHARS = 35 * 1024 * 1024;

// /**
//  * @swagger
//  * /api/share-report:
//  *   post:
//  *     summary: Email an inspection report PDF to one or more recipients
//  *     tags: [Reports]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [createdByUserUid, form, id, type, createdByUser, sentFrom, sendTo, pdfBase64]
//  *             properties:
//  *               createdByUserUid:
//  *                 type: string
//  *               form:
//  *                 type: object
//  *               id:
//  *                 type: string
//  *               type:
//  *                 type: string
//  *               createdByUser:
//  *                 type: object
//  *               sentFrom:
//  *                 type: string
//  *               sendTo:
//  *                 oneOf:
//  *                   - type: string
//  *                   - type: array
//  *                     items:
//  *                       type: string
//  *               pdfBase64:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Emails sent successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 success:
//  *                   type: boolean
//  *       500:
//  *         description: Failed to send email
//  */
export async function POST(request: Request) {
  const {
    createdByUserUid,
    form,
    id,
    type,
    createdByUser,
    sentFrom,
    sendTo,
    pdfBase64,
  } = (await request.json()) as InspectionFormEmailProps;

  try {
    const recipients = (Array.isArray(sendTo) ? sendTo : [sendTo]).filter(
      Boolean,
    );
    if (!pdfBase64 || recipients.length === 0) {
      return NextResponse.json(
        { error: "PDF and recipients are required." },
        { status: 400 },
      );
    }

    // keep raw value if malformed
    let typeSlug = String(type);
    try {
      typeSlug = decodeURI(typeSlug);
    } catch {} // eslint-disable-line

    // ---- Build shared pieces once ----
    const from = `${process.env.REPORT_SENT_FROM}`;
    const attachments = [
      {
        filename: `inspection-report-${id}-${typeSlug.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`,
        content: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
      },
    ];
    const subject = `New report form ${String(sentFrom ?? "").toLowerCase()}`;
    const failed: string[] = [];

    // One at a time keeps us under Resend's 2 req/s limit and isolates failures.
    for (const recipient of recipients) {
      const { error } = await resend.emails.send({
        from,
        to: recipient,
        subject,
        attachments,
        react: InspectionFormEmail({
          createdByUserUid,
          form,
          id,
          type,
          createdByUser,
          sentFrom,
          recipient,
        }),
      });

      if (error) {
        console.error(`Failed for ${recipient}: ${error.message}`); // eslint-disable-line
        failed.push(recipient);
      }

      await new Promise((resolve) => setTimeout(resolve, 600)); // Pace sends a little under Resend's 2 req/s limit.
    }

    if (failed.length === recipients.length) {
      return NextResponse.json(
        { error: "Failed to send email.", failed },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { status: "Ok", success: true, failed },
      { status: 200 },
    );
  } catch (e: unknown) {
    const details = e instanceof Error ? e.message : "Unknown error";
    console.error(`Failed to send email: ${details}`); // eslint-disable-line
    return NextResponse.json(
      { error: "Internal server error.", details },
      { status: 500 },
    );
  }
}
