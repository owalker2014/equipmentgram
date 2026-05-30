import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notify } from "../utils";
import { UserWithId } from "./users";

export const inspectionFormsCollection = "inspection-forms";

export interface InspectionRequest {
  equipment_type: string;
  manufacturer: string;
  model: string;
  section: string;
  component: string;
}

export interface InspectionResult extends InspectionRequest {
  id?: string;
  // equipment_type: string;
  // manufacturer: string;
  // model: string;
  // section: string;
  // component: string;
  timestamp: string;
  defect_present: boolean;
  defect_type: string;
  severity: number;
  observations: string;
  recommended_action: string;
  image_base64?: string;
}

export interface InspectionResultBatch {
  batch_id?: string;
  equipment_type: string;
  manufacturer: string;
  model: string;
  section: string;
  component_results: {
    component: string;
    success: boolean;
    error: string;
    defect_present: boolean;
    defect_type: string;
    severity: number;
    observations: string;
    recommended_action: string;
    // image_base64?: string;
    condition: string;
    component_score: number;
    risk_level: string;
  }[];
  timestamp: string;
  section_score: number;
  section_risk_level: string;
}

export interface ValidationError {
  loc: unknown;
  msg: string;
  type: string;
}

export interface QuestionForm {
  pages: QuestionPage[];
  nameOfBusiness?: string;
  customerEmail?: string;
  address?: {
    state: string;
    zip: string;
    city: string;
    line1: string;
    line2: string;
  };
  dateOfInspection?: any;
  timeOfInspection?: any;
  inspectorName?: string;
}

export interface QuestionPage {
  name: string;
  comment?: string;
  key: string;
  questions: Question[];
}

export interface Question {
  required?: boolean; // some components may not be required for inspection
  label: string;
  key: string;
  value?: string;
  imageUrl?: string;
  progress?: number;
  imageResult?: InspectionResult;
  file?: File;
  comment?: string;
}

export enum InspectionReportStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  FilledForm = "FilledForm",
}

export interface InspectionForm {
  type: string;
  createdByUserUid: string;
  createdByUser?: UserWithId;
  form: QuestionForm;
  reportStatus?: InspectionReportStatus;
  reportID?: string;
  equipmentType?: string;
  manufacturer?: string;
  equipmentManufacturer?: string;
  equipmentSerialNumber?: string;
  model?: string;
  equipmentModel?: string;
  nameOfBusiness?: string;
  address?: {
    state: string;
    zip: string;
    city: string;
    line1: string;
    line2: string;
  };
  customerEmail?: string;
  dateOfInspection?: any;
  timeOfInspection?: any;
  inspectorName?: string;
  requestedByUserRef?: unknown;
  requestedByUserId?: string;
  userRef?: unknown;
  // inspectionRequestRef?: DocumentReference<DocumentData>;
}

export interface InspectionFormWithId extends InspectionForm {
  id: string;
}

export const useAddFreshInspectionForm = (userId: string) => {
  const queryClient = useQueryClient();
  const navigation = useRouter();

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

        notify(
          {
            title: "Inspection Submission Successful",
            message: `Inspection record created successfully for \n
              ${variables.type} > ${variables.manufacturer} > ${variables.model}`,
          },
          false,
        );
        navigation.push(
          `/forms-saved/${variables.type}/${data.id}?mode=preview`,
        );
      },
      onError: (error: any) => {
        // console.error("error adding inspection --> ", error);
        notify(
          {
            title: "Inspection Submission Error",
            message:
              error.message ??
              "Error on submitting inspection form. Please try again later.",
          },
          true,
        );
      },
    },
  );
};

export const useAddNewInspectionForm = (
  inspectionRequestId: string,
  userId: string,
) => {
  const queryClient = useQueryClient();
  const navigation = useRouter();

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
        navigation.push("/forms");
      },
      onError: (error: unknown) => {
        notify(
          {
            title: "Inspection Submission Error",
            message:
              (error as Error).message ??
              "Error creating inspection form. Please try again later.",
          },
          true,
        );
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

    const url = `${process.env.NEXT_PUBLIC_DEFECT_DETECTION_URL}/inspect`;
    const response = await fetch(url, { method: "POST", body: formData });

    // Check if the request was successful (status in the 2xx range)
    if (!response.ok) {
      if ([400, 422].includes(response.status)) {
        // Validation Error
        const validationErrors: { detail: string } = await response.json();
        throw new Error(validationErrors?.detail ?? "Unknown Error");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: InspectionResult = await response.json(); // Parse the JSON response
    delete responseData.image_base64;
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

    notify({ title: "Inspection Error", message, color }, true);
    return ["Inspection Error", null];
  }
};
