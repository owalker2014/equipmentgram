import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../authContext";
import { InspectionFormWithId } from "./forms";

export const sentReportsCollection = "sent-reports";

export interface SentReport extends InspectionFormWithId {
  sentTo: string;
  inspectionFormId: string;
}

export const useAddNewSentReport = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation(
    async (sentReport: SentReport): Promise<void> => {
      await fetch("/api/inspections/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentReport,
          senderName: user?.displayName,
          senderEmail: user?.email,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([sentReportsCollection]);
        queryClient.refetchQueries([sentReportsCollection]);
      },
    },
  );
};

export const useGetSentReports = (equipmentType?: string) => {
  return useQuery<SentReport[], Error>(
    [sentReportsCollection, "sent-reports", equipmentType],
    async () => {
      const url = equipmentType
        ? `/api/inspections/reports?equipmentType=${encodeURIComponent(equipmentType)}`
        : "/api/inspections/reports";
      const res = await fetch(url);
      return res.json();
    },
  );
};
