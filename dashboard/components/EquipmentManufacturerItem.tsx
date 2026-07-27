import React from "react";
import { Button } from "@mantine/core";

type Props = {
  onClick: () => void;
  name: string;
  children?: React.ReactNode;
  loading: boolean;
};

const EquipmentManufacturerItem: React.FC<Props> = ({
  onClick,
  name,
  children,
  loading,
}) => {
  return (
    <>
      <Button
        size="lg"
        loading={loading}
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
