import React from "react";

type Props = {};

import type { Metadata } from "next";
import { Text, Title } from "@mantine/core";

export const metadata: Metadata = {
  title: "EquipmentGram - How It Works",
};

const ContactUsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="max-w-7xl mx-auto py-10">
        <Title className="text-centerx">Contact Us</Title>

        <Text size="sm" className="text-centerx text-gray-600">
          Leave us a message below and we will get back to you as soon as
          possible.
        </Text>
      </div>
      {children}
    </>
  );
};

export default ContactUsLayout;
