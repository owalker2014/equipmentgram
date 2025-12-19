import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebaseConfig/init";
import { UsersCollection } from "./users";
import { DocumentData } from "firebase-admin/firestore";
import { DocumentReference, FieldValue } from "firebase/firestore";
import { EquipmentType, InspectionReportStatus } from "./forms";
import { EquipmentManufacturer } from "@/utils/formUtils";

export enum Step {
  Request = "Request",
  Schedule = "Schedule",
  Inspection = "Inspection",
  Results = "Results",
  Complete = "Complete",
}

export type InspectionRequestObject = {
  user_id: string;
  inspectorRef: DocumentReference<DocumentData>;
  firstName: string;
  lastName: string;
  businessName?: string;
  email: string;
  mobile: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  date: Date;
  equipmentType: EquipmentType;
  equipmentManufacturer: EquipmentManufacturer;
  equipmentModel?: string;
  equipmentSerialNumber: string;
  readFAQReceipt: boolean;
  notes?: string;
  step: Step;
  created: FieldValue;
  canceled: boolean;
  reportStatus: InspectionReportStatus;
};

export const InspectionRequestsCollection = "inspection-requests";

export type InspectionRequestObjectWithId = Partial<InspectionRequestObject> & {
  id: string;
};

export const useInspectionRequests = () => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [InspectionRequestsCollection],
    async () => {
      const snapshot = await getDocs(
        collection(db, InspectionRequestsCollection)
      );
      return snapshot.docs.map(
        (doc) =>
          ({ id: doc.id, ...doc.data() } as InspectionRequestObjectWithId)
      );
    }
  );
};

export const useInspectionRequestsForInspectors = (
  user_id: string | undefined,
  equipmentType: string
) => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [InspectionRequestsCollection, user_id, equipmentType],
    async () => {
      if (!user_id) {
        return [];
      }
      const userDocRef = doc(db, "users", user_id);

      const q = query(
        collection(db, InspectionRequestsCollection),
        where("inspectorRef", "==", userDocRef), // Compare with the reference
        where("equipmentType", "==", equipmentType), // Compare with the reference
        where("reportStatus", "==", InspectionReportStatus.Pending)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({ id: doc.id, ...doc.data() } as InspectionRequestObjectWithId)
      );
    },
    {
      enabled: !!user_id,
    }
  );
};

// Define a custom hook that uses useQuery to fetch all inspection requests for a given user
export const useInspectionRequestsForUser = (user_id: string | undefined) => {
  return useQuery<InspectionRequestObjectWithId[], Error>(
    [InspectionRequestsCollection, user_id],
    async () => {
      const q = await query(
        collection(db, InspectionRequestsCollection),
        where("user_id", "==", user_id),
        where("canceled", "==", false)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({ id: doc.id, ...doc.data() } as InspectionRequestObjectWithId)
      );
    },
    {
      enabled: !!user_id,
    }
  );
};

// Define a custom hook that uses useQuery to add inspection requests on firebase
export const useAddInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (inspectionRequest: InspectionRequestObject) =>
      addDoc(collection(db, InspectionRequestsCollection), inspectionRequest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionRequestsCollection]);
        queryClient.refetchQueries([InspectionRequestsCollection]);
      },
    }
  );
};

// To add an inspector to an inspection request, we simply set the inspectorRef to the user document
// and set the step to "Inspection" to signify that the inspection request is ready to handle an inspection
export const useAddInspectorToInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      user_id,
      inspection_request_id,
    }: {
      user_id: string;
      inspection_request_id: string;
    }) => {
      const userDoc = doc(db, UsersCollection, user_id);
      return updateDoc(
        doc(db, InspectionRequestsCollection, inspection_request_id!),
        {
          inspectorRef: userDoc,
          step: Step.Inspection,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionRequestsCollection]);
        queryClient.refetchQueries([InspectionRequestsCollection]);
      },
    }
  );
};

// To remove an inspector from an inspection request, we simply set the inspectorRef to null
// and set the step to "schedule" to signify that the inspection request is ready to be scheduled
export const useRemoveInspectorFromInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ inspection_request_id }: { inspection_request_id: string }) => {
      return updateDoc(
        doc(db, InspectionRequestsCollection, inspection_request_id!),
        {
          inspectorRef: null,
          step: Step.Schedule,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionRequestsCollection]);
        queryClient.refetchQueries([InspectionRequestsCollection]);
      },
    }
  );
};

export const useUpdateInspectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (inspectionRequest: InspectionRequestObjectWithId) =>
      updateDoc(
        doc(db, InspectionRequestsCollection, inspectionRequest.id),
        inspectionRequest
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionRequestsCollection]);
        queryClient.refetchQueries([InspectionRequestsCollection]);
      },
    }
  );
};
