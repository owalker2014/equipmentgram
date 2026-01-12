import { Button } from "@mantine/core";

type Props = {
  onClick: () => void;
  item: any;
  children?: React.ReactNode;
};

const EquipmentItem = ({ onClick, item, children }: Props) => {
  return (
    <>
      <Button
        size="xl"
        className="flex max-w-full min-w-[300px] text-lg bg-blue-700"
        onClick={onClick}
      >
        {/* <item.icon color={theme.colors[item.color][6]} size="2rem" /> */}
        {item.title}
      </Button>
      {children}
    </>
  );
};

export default EquipmentItem;
