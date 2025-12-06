"use client";

import EquipmentItem from "@/components/EquipmentItem";
import { equipments } from "@/utils/equipment";
import { equipmentsInScope } from "@/utils/formUtils";
import { Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const SavedFormsPage = (props: Props) => {
  const navigation = useRouter();

  const items = equipments
    .filter((o: any) => equipmentsInScope.includes(o.title))
    .map((item, i) => (
      <EquipmentItem
        key={i}
        item={item}
        onClick={() => navigation.push("/forms-saved".concat(item.link))}
      />
    ));

  return (
    <div>
      <Text className="mb-4 text-2xl font-bold">Saved Forms</Text>
      <div className="space-y-2">{items}</div>
    </div>
  );
};

export default SavedFormsPage;
