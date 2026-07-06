"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export * from "./forms.shared";
import { inspectionFormsCollection } from "./forms.shared";
import type {
  InspectionForm,
  InspectionFormWithId,
  InspectionRequest,
  InspectionResult,
  InspectionResultBatch,
} from "./forms.shared";

export const useAddFreshInspectionForm = (
  userId: string,
  callbacks: {
    onSuccess?: (data: any, variables: InspectionForm) => void;
    onError?: (error: any) => void;
  } = {},
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inspectionForm: InspectionForm): Promise<any> => {
      const res = await fetch("/api/inspections/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inspectionForm, userId }),
      });
      return res.json();
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([inspectionFormsCollection]);
        queryClient.refetchQueries([inspectionFormsCollection]);
        callbacks.onSuccess?.(data, variables);
      },
      onError: (error: any) => {
        callbacks.onError?.(error);
      },
    },
  );
};

export const useAddNewInspectionForm = (
  inspectionRequestId: string,
  userId: string,
  callbacks: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {},
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inspectionForm: InspectionForm): Promise<void> => {
      await fetch("/api/inspections/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inspectionForm,
          userId,
          inspectionRequestId,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionFormsCollection]);
        queryClient.refetchQueries([inspectionFormsCollection]);
        callbacks.onSuccess?.();
      },
      onError: (error: unknown) => {
        callbacks.onError?.(error);
      },
    },
  );
};

export const useGetInspectionFormByType = (
  userId: string,
  equipmentType?: string,
  isCustomer?: boolean,
) => {
  return useQuery<InspectionFormWithId[], Error>(
    [inspectionFormsCollection, "inspection-forms", equipmentType],
    async () => {
      const params = new URLSearchParams({ userId });
      if (equipmentType) params.set("equipmentType", equipmentType);
      if (isCustomer) params.set("isCustomer", "true");
      const res = await fetch(`/api/inspections/forms?${params}`);
      return res.json();
    },
  );
};

export const useGetInspectionFormById = (id: string) => {
  return useQuery<InspectionFormWithId, Error>(
    [inspectionFormsCollection, id],
    async () => {
      const res = await fetch(`/api/inspections/forms/${id}`);
      if (!res.ok) throw new Error("Inspection form not found");
      return res.json();
    },
  );
};

export const runInspection = async (
  file: File,
  {
    component,
    equipment_type,
    manufacturer,
    model,
    section,
  }: InspectionRequest,
) => {
  try {
    const formData = new FormData();
    formData.append("equipment_type", equipment_type);
    formData.append("manufacturer", manufacturer);
    formData.append("model", model);
    formData.append("section", section);
    formData.append("component", component);
    formData.append("image", file);

    const response = await fetch("/api/inspections/mono", {
      method: "POST",
      body: formData,
    });

    // Check if the request was successful (status in the 2xx range)
    if (!response.ok) {
      const body: { error?: string } = await response.json();
      throw new Error(body.error ?? `HTTP error! status: ${response.status}`);
    }

    const responseData: InspectionResult = await response.json(); // Parse the JSON response
    return [null, responseData];
  } catch (error: unknown) {
    // console.error("Error during defect detection: ", error);
    const err = error as Error & {
      loc?: unknown;
      msg?: unknown;
      type?: unknown;
    };
    let message = err.message;
    let color = "red";

    if (
      err.loc !== undefined &&
      err.msg !== undefined &&
      err.type !== undefined
    ) {
      // Handle ValidationError
      message = `Error occurred on analyzing for ${component}`;
      color = "yellow";
    }

    return [{ title: "Inspection Error", message, color }, null];
  }
};

/**
 * Run inspection for multiple components and images in batch (By Section)
 *
 * @param mediaFiles The list of images submited
 * @param components THe components with pictures
 * @param param2
 * @returns
 */
export const runInspections = async (
  mediaFiles: File[],
  components: string[],
  {
    equipment_type,
    manufacturer,
    model,
    section,
  }: Omit<InspectionRequest, "component">,
) => {
  try {
    if (!mediaFiles.length || !components.length) {
      throw new Error("No components/media files provided");
    }

    const formData = new FormData();
    formData.append("equipment_type", equipment_type);
    formData.append("manufacturer", manufacturer);
    formData.append("model", model);
    formData.append("section", section);
    formData.append("components", components.join(","));
    mediaFiles.forEach((file) => formData.append("images", file)); // Append the array of files

    const response = await fetch("/api/inspections", {
      method: "POST",
      body: formData,
    });

    // Check if the request was successful (status in the 2xx range)
    if (!response.ok) {
      const body: { error?: string } = await response.json();
      throw new Error(body.error ?? `HTTP error! status: ${response.status}`);
    }

    const responseData: InspectionResultBatch = await response.json(); // Parse the JSON response
    return { errors: null, results: responseData };
  } catch (error: unknown) {
    const err = error as Error & {
      loc?: unknown;
      msg?: unknown;
      type?: unknown;
    };
    let message = err.message;
    let color = "red";

    if (
      err.loc !== undefined &&
      err.msg !== undefined &&
      err.type !== undefined
    ) {
      // Handle ValidationError
      message = `Error occurred on analyzing for ${components}`;
      color = "yellow";
    }

    return {
      notifyError: { title: "Inspection Error", message, color },
      errors: null,
      results: null,
    };
  }
};
