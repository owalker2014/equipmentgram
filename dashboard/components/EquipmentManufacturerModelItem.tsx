import React from "react";
import { Button } from "@mantine/core";

type Props = {
  onClick: () => void;
  name: string;
  loading?: boolean;
};

const EquipmentManufacturerModelItem: React.FC<Props> = ({
  onClick,
  name,
  loading,
}) => {
  return (
    <Button
      size="md"
      loading={loading}
      className="flex min-w-full text-sm bg-gray-500 hover:bg-gray-600 text-white"
      onClick={onClick}
    >
      {name}
    </Button>
  );
};

export default EquipmentManufacturerModelItem;
