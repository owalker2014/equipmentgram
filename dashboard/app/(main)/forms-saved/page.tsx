"use client";

import CustomLoader from "@/components/CustomLoader";
import EquipmentItem from "@/components/EquipmentItem";
import { useGetEquipments } from "@/lib/network/equipment";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

type Props = Record<string, never>;

const SavedFormsPage = (props: Props) => {
  const navigation = useRouter();
  const { data: equipments, isLoading: isLoadingEquipments } =
    useGetEquipments();

  const items = equipments?.map((item, i) => (
    <EquipmentItem
      key={i}
      item={item}
      onClick={() => navigation.push("/forms-saved/".concat(item.id!))}
    />
  ));

  return (
    <>
      <Title size={30}>Saved Forms</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Saved Inspection Forms
      </Text>
      <Divider className="mb-8" />

      {isLoadingEquipments && (
        <CustomLoader message="Loading Equipments" type="dots" />
      )}
      <div className="space-y-2">{items}</div>
    </>
  );
};

export default SavedFormsPage;
