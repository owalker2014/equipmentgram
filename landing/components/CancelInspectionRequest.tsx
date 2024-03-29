import { InspectionRequestObjectWithId, useUpdateInspectionRequest } from "@/lib/network/inspection-requests";
import { Button } from "@mantine/core";
import { FC } from "react";

interface CancelInspectionRequestProps {
  inspectionRequest: InspectionRequestObjectWithId;
}

export const CancelInspectionRequest: FC<CancelInspectionRequestProps> = ({ inspectionRequest }) => {
  const { mutateAsync, isLoading } = useUpdateInspectionRequest();

  return (
    <Button
      loading={isLoading}
      variant="transparent"
      onClick={() => {
        mutateAsync({
          ...inspectionRequest,
          canceled: true,
        });
      }}
    >
      <span className="pl-2 transform rotate-180">
        <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
          <path d="M19.2188 8.90632L17.0625 6.34382C16.875 6.12507 16.5312 6.09382 16.2813 6.28132C16.0625 6.46882 16.0313 6.81257 16.2188 7.06257L18.25 9.46882H0.9375C0.625 9.46882 0.375 9.71882 0.375 10.0313C0.375 10.3438 0.625 10.5938 0.9375 10.5938H18.25L16.2188 13.0001C16.0313 13.2188 16.0625 13.5626 16.2813 13.7813C16.375 13.8751 16.5 13.9063 16.625 13.9063C16.7813 13.9063 16.9375 13.8438 17.0313 13.7188L19.1875 11.1563C19.75 10.4688 19.75 9.53132 19.2188 8.90632Z" />
        </svg>
      </span>
      Cancel Inspection Request
    </Button>
  );
};
