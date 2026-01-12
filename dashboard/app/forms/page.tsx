"use client";

import CustomLoader from "@/components/CustomLoader";
import EquipmentItem from "@/components/EquipmentItem";
import { useAuth } from "@/lib/authContext";
import { UserType, useGetUser } from "@/lib/network/users";
import { equipments } from "@/utils/equipment";
import { equipmentsInScope } from "@/utils/formUtils";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import EquipmentManufacturerItem from "@/components/EquipmentManufacturerItem";
import EquipmentManufacturerModelItem from "@/components/EquipmentManufacturerModelItem";
import { useCallback, useEffect, useState } from "react";
import { notify } from "@/lib/utils";

type Props = {
  params: any;
};

const FormsPage = (props: Props) => {
  const navigation = useRouter();
  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.uid as string);

  const [equipment0, setEquipment0] = useState<string | null>(null);
  const [manufacturer0, setManufacturer0] = useState<string | null>(null);

  if (!isLoading && userData?.type !== UserType.inspector) {
    notify(
      {
        title: "Unauthorized",
        message: "You are not authorized to view this page",
        clean: true,
      },
      true
    );

    navigation.push("/");
    return;
  }

  const manufacturerModels = useCallback(
    (equipment: string, link: string, manufacturer: string) =>
      (equipmentsInScope as any)[equipment][manufacturer].models.map(
        (model: string, idx: number) => (
          <EquipmentManufacturerModelItem
            key={`manufacturer-model-${idx}`}
            name={model}
            onClick={() => {
              navigation.push(
                "/forms"
                  .concat(link.split(" ").join("-"))
                  .concat(`/${manufacturer}?model=${model}`)
              );
            }}
          />
        )
      ),
    []
  );

  const manufacturers = useCallback(
    (equipment: string, link: string) =>
      Object.keys((equipmentsInScope as any)[equipment]).map(
        (manufacturer: string, idx: number) => (
          <EquipmentManufacturerItem
            key={`manufacturer-${idx}`}
            name={manufacturer}
            onClick={() => {
              if (manufacturer0 === manufacturer) {
                setManufacturer0(null);
                return;
              }
              setManufacturer0(manufacturer);
            }}
          >
            {manufacturer0 === manufacturer && (
              <div className="ml-5 grid grid-cols-4 gap-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 max-w-full xl:max-w-[70vw]">
                {manufacturerModels(equipment, link, manufacturer)}
              </div>
            )}
          </EquipmentManufacturerItem>
        )
      ),
    [manufacturer0]
  );

  useEffect(() => {
    setManufacturer0(null);
  }, [equipment0]);

  const items = equipments
    .filter((o: any) => Object.keys(equipmentsInScope).includes(o.title))
    .map((item, i) => (
      <EquipmentItem
        key={`equipment-item-${i}`}
        item={item}
        onClick={() => {
          if (equipment0 === item.title) {
            setEquipment0(null);
            return;
          }
          setEquipment0(item.title);
          // navigation.push("/forms".concat(item.link.split(" ").join("-")))
        }}
      >
        {equipment0 === item.title && (
          <div className="ml-5 mt-2x mb-3 space-y-4">
            {manufacturers(item.title, item.link)}
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

      {isLoading && <CustomLoader />}
      {!isLoading && <div className="space-y-3">{items}</div>}
    </>
  );
};

export default FormsPage;
