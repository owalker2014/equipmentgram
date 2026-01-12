"use client";

import CustomLoader from "@/components/CustomLoader";
import EquipmentItem from "@/components/EquipmentItem";
import { useAuth } from "@/lib/authContext";
import { UserType, useGetUser } from "@/lib/network/users";
import { equipments } from "@/utils/equipment";
import { equipmentsInScope } from "@/utils/formUtils";
import { Divider, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/utils";

type Props = {
  params: any;
};

const FormsPage = (props: Props) => {
  const navigation = useRouter();
  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.uid as string);


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

  const items = equipments
    .filter((o: any) => Object.keys(equipmentsInScope).includes(o.title))
    .map((item, i) => (
      <EquipmentItem
        key={i}
        item={item}
        onClick={() =>
          navigation.push("/forms".concat(item.link.split(" ").join("-")))
        }
      />
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
