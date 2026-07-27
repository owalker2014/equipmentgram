"use client";

import CustomLoader from "@/components/CustomLoader";
import EquipmentItem from "@/components/EquipmentItem";
import { useAuth } from "@/lib/authContext";
import { UserType, useGetUser } from "@/lib/network/users";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import EquipmentManufacturerItem from "@/components/EquipmentManufacturerItem";
import EquipmentManufacturerModelItem from "@/components/EquipmentManufacturerModelItem";
import { useCallback, useEffect, useState } from "react";
import { notify } from "@/lib/utils";
import {
  useGetEquipmentManufacturerModels,
  useGetEquipmentManufacturers,
  useGetEquipments,
} from "@/lib/network/equipment";

type Props = {
  params: any;
};

const FormsPage = (props: Props) => {
  const navigation = useRouter();
  const [equipment0, setEquipment0] = useState<string | null>(null);
  const [manufacturer0, setManufacturer0] = useState<string | null>(null);

  // custom-hooks
  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.uid as string);
  const { data: equipmentTypes, isLoading: isLoadingEquipments } =
    useGetEquipments();
  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useGetEquipmentManufacturers(equipment0 ?? "");
  const { data: manufacturerModels, isLoading: isLoadingModels } =
    useGetEquipmentManufacturerModels(equipment0!, manufacturer0 ?? "");

  const manufacturerModelsFn = useCallback(
    (equipmentType: string, manufacturer: string) =>
      manufacturerModels?.map((model, idx: number) => (
        <EquipmentManufacturerModelItem
          key={`manufacturer-model-${idx}`}
          name={model.label}
          loading={isLoadingModels}
          onClick={() => {
            navigation.push(
              `/forms/${equipmentType}/inspect?manufacturer=${manufacturer}&model=${model.id}`,
            );
          }}
        />
      )),
    [manufacturerModels, navigation],
  );

  const manufacturersFn = useCallback(
    (equipmentType: string) =>
      manufacturers?.map((manufacturer, idx: number) => (
        <EquipmentManufacturerItem
          key={`manufacturer-${idx}`}
          name={manufacturer.label}
          loading={isLoadingManufacturers}
          onClick={() => {
            if (manufacturer0 === manufacturer.id) {
              setManufacturer0(null);
              return;
            }
            setManufacturer0(manufacturer.id!);
          }}
        >
          {manufacturer0 === manufacturer.id && (
            <div className="ml-5 grid grid-cols-4 gap-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 max-w-full xl:max-w-[70vw]">
              {manufacturerModelsFn(equipmentType, manufacturer.id)}
            </div>
          )}
        </EquipmentManufacturerItem>
      )),
    [manufacturer0, manufacturers, manufacturerModelsFn],
  );

  useEffect(() => {
    setManufacturer0(null);
  }, [equipment0]);

  useEffect(() => {
    if (!isLoading && userData?.type !== UserType.inspector) {
      notify(
        {
          title: "Unauthorized",
          message: "You are not authorized to view this page",
          clean: true,
        },
        true,
      );
      navigation.push("/");
    }
  }, [isLoading, userData, navigation]);

  const items = equipmentTypes?.map((item, i) => (
    <EquipmentItem
      key={`equipment-item-${i}`}
      item={item}
      onClick={() => {
        if (equipment0 === item.id) {
          setEquipment0(null);
          return;
        }
        setEquipment0(item.id!);
      }}
    >
      {equipment0 === item.id && (
        <div className="ml-5 mt-2x mb-3 space-y-4">
          {manufacturersFn(item.id)}
        </div>
      )}
    </EquipmentItem>
  ));

  return (
    <>
      <Title size={30}>Inspection Forms</Title>
      <Text size="sm" className="mb-2 text-gray-500">
        Overview of Equipment Types / Manufacturers / Models
      </Text>
      <Divider className="mb-8" />

      {(isLoading || isLoadingEquipments) && <CustomLoader />}
      {!isLoading && <div className="space-y-3">{items}</div>}
    </>
  );
};

export default FormsPage;
