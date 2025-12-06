"use client";

import CustomLoader from "@/components/CustomLoader";
import EquipmentItem from "@/components/EquipmentItem";
import { useAuth } from "@/lib/authContext";
import { UserType, useGetUser } from "@/lib/network/users";
import { equipments } from "@/utils/equipment";
import { Text } from "@mantine/core";
import { useRouter } from "next/navigation";

type Props = {};

const FormsPage = (props: Props) => {
  const { user } = useAuth();
  const { data: userData, isLoading } = useGetUser(user?.uid as string);

  if (isLoading) return <CustomLoader />;
  if (userData?.type !== UserType.inspector) return <div>Not Authorized</div>;

  const navigation = useRouter();
  const items = equipments.map((item, i) => (
    <EquipmentItem
      key={i}
      item={item}
      onClick={() =>
        navigation.push("/forms".concat(item.link.split(" ").join("-")))
      }
    />
  ));

  return (
    <div>
      <Text className="mb-4 text-2xl font-bold">Inspection Forms</Text>
      <div className="space-y-2">{items}</div>
    </div>
  );
};

export default FormsPage;
