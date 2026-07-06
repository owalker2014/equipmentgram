"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export * from "./inspection-requests.shared";
import type {
  InspectionRequestObject,
  InspectionRequestObjectWithId,
} from "./inspection-requests.shared";
import {
  inspectionRequestsCollection,
  Step,
} from "./inspection-requests.shared";

export const useInspectionRequests = () => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [inspectionRequestsCollection],
    async () => {
      const res = await fetch("/api/inspections/requests");
      return res.json();
    },
  );
};

export const useInspectionRequestsForInspectors = (
  user_id: string | undefined,
  equipmentType: string,
) => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [inspectionRequestsCollection, user_id, equipmentType],
    async () => {
      if (!user_id) {
        return [];
      }
      const res = await fetch(
        `/api/inspections/requests?inspectorId=${user_id}&equipmentType=${encodeURIComponent(equipmentType)}`,
      );
      return res.json();
    },
    { enabled: !!user_id },
  );
};

/**
 * Define a custom hook that uses useQuery to fetch all inspection requests for a given user
 */
export const useInspectionRequestsForUser = (user_id: string | undefined) => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [inspectionRequestsCollection, user_id],
    async () => {
      const res = await fetch(`/api/inspections/requests?userId=${user_id}`);
      return res.json();
    },
    { enabled: !!user_id },
  );
};

/**
 * Define a custom hook that uses useQuery to add inspection requests on firebase
 */
export const useAddInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (inspectionRequest: InspectionRequestObject) => {
      const res = await fetch("/api/inspections/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inspectionRequest),
      });
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionRequestsCollection]);
        queryClient.refetchQueries([inspectionRequestsCollection]);
      },
    },
  );
};

/**
 * To add an inspector to an inspection request, we simply set the inspectorRef to the user document
 * and set the step to "Inspection" to signify that the inspection request is ready to handle an inspection
 */
export const useAddInspectorToInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      user_id,
      inspection_request_id,
    }: {
      user_id: string;
      inspection_request_id: string;
    }) => {
      await fetch(`/api/inspections/requests/${inspection_request_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inspectorId: user_id,
          step: Step.Inspection,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionRequestsCollection]);
        queryClient.refetchQueries([inspectionRequestsCollection]);
      },
    },
  );
};

/**
 * To remove an inspector from an inspection request, we simply set the inspectorRef to null
 * and set the step to "schedule" to signify that the inspection request is ready to be scheduled
 */
export const useRemoveInspectorFromInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ inspection_request_id }: { inspection_request_id: string }) => {
      await fetch(`/api/inspections/requests/${inspection_request_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inspectorRef: null,
          step: Step.Schedule,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionRequestsCollection]);
        queryClient.refetchQueries([inspectionRequestsCollection]);
      },
    },
  );
};

export const useUpdateInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (inspectionRequest: InspectionRequestObjectWithId) => {
      await fetch(`/api/inspections/requests/${inspectionRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inspectionRequest),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionRequestsCollection]);
        queryClient.refetchQueries([inspectionRequestsCollection]);
      },
    },
  );
};
