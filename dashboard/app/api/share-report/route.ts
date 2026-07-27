import InspectionFormEmail, {
  InspectionFormEmailProps,
} from "@/components/emails/InspectionFormEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

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
    const recipients = Array.isArray(sendTo) ? sendTo : [sendTo];
    const { data, error } = await resend.batch.send(
      recipients.map((recipient) => ({
        from: `${process.env.NEXT_PUBLIC_REPORT_SENT_FORM}`,
        to: recipient,
        subject: `New report form ${sentFrom.toLowerCase()}`,
        attachments: [
          {
            filename: `inspection-report-${id}-${decodeURI(type)
              .replace(/\s+/g, "-")
              .toLowerCase()}-${Date.now()}.pdf`,
            content: pdfBase64,
          },
        ],
        react: InspectionFormEmail({
          createdByUserUid,
          form,
          id,
          type,
          createdByUser,
          sentFrom,
          recipient,
        }),
      })),
    );

    if (error) {
      console.log(`Failed to send email: ${error.message}`); // eslint-disable-line
      return NextResponse.json(
        { error: "Failed to send email.", details: error.message },
        { status: 500 },
      );
    }
    // console.log(`Email sent with id: ${id}`);

    return NextResponse.json(
      { status: "Ok", success: true, data },
      { status: 200 },
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`Failed to send email: ${e.message}`); // eslint-disable-line
    }
    return NextResponse.json(
      {
        error: "Internal server error.",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
