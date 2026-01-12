"use client";

import EquipmentItem from "@/components/EquipmentItem";
import { equipments } from "@/utils/equipment";
import { equipmentsInScope } from "@/utils/formUtils";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const SavedFormsPage = (props: Props) => {
  const navigation = useRouter();

  const items = equipments
    .filter((o: any) => Object.keys(equipmentsInScope).includes(o.title))
    .map((item, i) => (
      <EquipmentItem
        key={i}
        item={item}
        onClick={() => navigation.push("/forms-saved".concat(item.link))}
      />
    ));

  return (
    <>
      <Title size={30}>Saved Forms</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Saved Inspection Forms
      </Text>
      <Divider className="mb-8" />
      <div className="space-y-2">{items}</div>
    </>
  );
};

export default SavedFormsPage;
