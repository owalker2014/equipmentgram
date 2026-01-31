import { ActionIcon, Center, Loader, Tooltip } from "@mantine/core";
import { IconDoorExit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  message?: string;
  type?: string;
};

function CustomLoader({ message, type }: Props) {
  return (
    <Center h="100%" w="100%">
      <Loader size={30} type={type ?? "bars"} children={<>{message}</>} />
    </Center>
  );
}

export function ReturnButton({ target }: { target: string }) {
  const navigation = useRouter();

  return (
    <div className="flex flex-row-reverse">
      <ActionIcon.Group>
        <Tooltip label="Return">
          <ActionIcon
            variant="white"
            className="pb-3"
            size="md"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            <IconDoorExit
              aria-label="Back"
              onClick={() => navigation.push(target)}
              size={50}
            />
          </ActionIcon>
        </Tooltip>
      </ActionIcon.Group>
    </div>
  );
}

export default CustomLoader;
