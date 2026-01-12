import React from "react";
import type { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "EquipmentGram - Inspection Request",
};

const InspectionRequestLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default InspectionRequestLayout;
