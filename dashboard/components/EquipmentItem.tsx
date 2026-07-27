import { Button } from "@mantine/core";
import React from "react";

type Props = {
  onClick: () => void;
  item: any;
  children?: React.ReactNode;
  loading?: boolean;
};

const EquipmentItem = ({ onClick, item, children, loading }: Props) => {
  return (
    <>
      <Button
        size="xl"
        loading={loading}
        className="flex max-w-full min-w-[300px] text-lg bg-blue-700"
        onClick={onClick}
      >
        {/* <item.icon color={theme.colors[item.color][6]} size="2rem" /> */}
        {item.title ?? item.label}
      </Button>
      {children}
    </>
  );
};

export default EquipmentItem;
