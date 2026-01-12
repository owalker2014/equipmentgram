import InspectionFormEmail, {
  InspectionFormEmailProps,
} from "@/components/emails/InspectionFormEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  const { createdByUserUid, form, id, type, createdByUser, sentFrom, sendTo } =
    (await request.json()) as InspectionFormEmailProps;

  try {
    await resend.sendEmail({
      from: `${process.env.NEXT_PUBLIC_REPORT_SENT_FORM}`,
      to: sendTo,
      subject: `New report form ${sentFrom.toLowerCase()}`,
      react: InspectionFormEmail({
        createdByUserUid,
        form,
        id,
        type,
        createdByUser,
        sentFrom,
        sendTo,
      }),
    });
    console.log(`Email sent with id: ${id}`);

    return NextResponse.json(
      {
        status: "Ok",
      },
      {
        status: 200,
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`Failed to send email: ${e.message}`);
    }
    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
