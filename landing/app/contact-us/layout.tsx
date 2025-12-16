import React from "react";

type Props = {};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EquipmentGram - How It Works",
};

const ContactUsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ContactUsLayout;
