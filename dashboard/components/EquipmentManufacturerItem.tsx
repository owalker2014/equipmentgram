import React from "react";
import { Button } from "@mantine/core";

type Props = {
  onClick: () => void;
  name: string;
  children?: React.ReactNode;
};

const EquipmentManufacturerItem: React.FC<Props> = ({
  onClick,
  name,
  children,
}) => {
  return (
    <>
      <Button
        size="lg"
        className="flex max-w-full min-w-[300px] text-lg bg-slate-200 hover:bg-slate-300 text-black"
        onClick={onClick}
      >
        {name}
      </Button>
      {children}
    </>
  );
};

export default EquipmentManufacturerItem;
