"use client";

import { InspectionRequestsForInspectorsTable } from "@/components/Tables/InspectionRequestsForInspectorsTable";
import { EquipmentType } from "@/utils/formUtils";
import React from "react";

const AssignedForms: React.FC = () => {
  return (
    <div>
      <InspectionRequestsForInspectorsTable
        equipmentType={EquipmentType.CompactExcavator}
      />
    </div>
  );
};

export default AssignedForms;
