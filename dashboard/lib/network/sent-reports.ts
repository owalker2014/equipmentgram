"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../authContext";

export * from "./sent-reports.shared";
import { sentReportsCollection } from "./sent-reports.shared";
import type { SentReport } from "./sent-reports.shared";

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
