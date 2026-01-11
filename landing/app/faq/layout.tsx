import React from "react";

type Props = {};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EquipmentGram - FAQ",
};

const FaqLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default FaqLayout;
