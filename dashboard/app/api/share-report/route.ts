import InspectionFormEmail, {
  InspectionFormEmailProps,
} from "@/components/emails/InspectionFormEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

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
    const { error } = await resend.batch.send(recipients.map((recipient) => ({
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
    })));

    if (error) {
      console.log(`Failed to send email: ${error.message}`); // eslint-disable-line
      return NextResponse.json(
        { error: "Failed to send email.", details: error.message },
        { status: 500 },
      );
    }
    // console.log(`Email sent with id: ${id}`);

    return NextResponse.json({ status: "Ok", success: true }, { status: 200 });
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
