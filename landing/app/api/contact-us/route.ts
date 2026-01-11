import ContactUsEmail, {
  ContactUsEmailProps,
} from "@/components/emails/ContactUsEmail";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const slack = new WebClient(process.env.SLACK_OAUTH_CONTACT!, {});

export async function POST(request: Request) {
  const { email, message, name, phone } =
    (await request.json()) as ContactUsEmailProps;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_CONTACT_SENT_FORM}`,
      to: `${process.env.NEXT_PUBLIC_CONTACT_US_SENT_TO}`,
      subject: `${name} wants to contact you`,
      react: ContactUsEmail({
        email,
        message,
        name,
        phone,
      }),
    });

    if (error) {
      console.error(`Failed to send contact us email: ${error.message}`);
      return NextResponse.json(
        {
          error: "Failed to send email.",
        },
        {
          status: 500,
        }
      );
    }

    await slack.conversations.join({
      channel: process.env.SLACK_CHANNEL_ID_CONTACT!,
    });

    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID_CONTACT!,
      text: `New contact us form from ${name} .\nEmail: ${email} .\nPhone: ${phone} .\nMessage: ${message}`,
    });

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
      console.error(`Failed to send email/slack message  : ${e.message}`);
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
