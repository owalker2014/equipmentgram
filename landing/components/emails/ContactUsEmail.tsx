import { Body, Head, Tailwind, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import React from "react";

export interface ContactUsEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactUsEmail = ({
  email,
  message,
  name,
  phone,
}: ContactUsEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <Text className="text-[18px] font-bold p-0 my-[30px] mx-0">
            {name} wants to connect with you.
          </Text>
          <Text className="text-[18px] font-normal p-0 my-[30px] mx-0">
            Email: {email}
          </Text>
          <Text className="text-[18px] font-normal p-0 my-[30px] mx-0">
            Phone: {phone}
          </Text>
          <Text className="text-[18px] font-normal p-0 my-[30px] mx-0">
            Message: {message}
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactUsEmail;
