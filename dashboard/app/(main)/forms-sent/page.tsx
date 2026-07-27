"use client";

import EquipmentItem from "@/components/EquipmentItem";
import { useGetEquipments } from "@/lib/network/equipment";
// import { equipmentsInScope } from "@/utils/formUtils";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

type Props = Record<string, never>;

const FormsSentPage = (props: Props) => {
  const navigation = useRouter();
  const { data: equipments, isLoading: isLoadingEquipments } =
    useGetEquipments();

  const items = equipments
    // .filter((o: any) => Object.keys(equipmentsInScope).includes(o.title))
    ?.map((item, i) => (
      <EquipmentItem
        key={i}
        item={item}
        onClick={() => navigation.push(`/forms-sent/${item.id}`)}
      />
    ));

  return (
    <>
      <Title size={30}>Sent Forms</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Sent Inspection Reports
      </Text>
      <Divider className="mb-8" />
      <div className="space-y-2">{items}</div>
    </>
  );
};

export default FormsSentPage;
