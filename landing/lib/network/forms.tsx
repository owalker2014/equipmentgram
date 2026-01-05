import { addDoc, collection } from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { InspectionRequestObject } from "../../components/forms/InspectionRequestForm";
import { Step } from "../../components/forms/StepWidget";
import { db } from "../firebaseConfig/init";
import { InspectionRequestsCollection } from "./inspection-requests";
import { UserWithId, UsersCollection } from "./users";
import { notifications } from "@mantine/notifications";

export const InspectionFormsCollection = "inspection-forms";

export enum EquipmentType {
  Backhoe = "Backhoe",
  CompactLoaders = "Compact Loaders",
  Dozers = "Dozers",
  WheelLoaders = "Wheel Loaders",
  Excavators = "Excavators",
  MiniExcavators = "Mini Excavators",
  Skidsteers = "Skidsteers",
  Telehandlers = "Telehandlers",
  MotorGraders = "Motor Graders",
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
}
export interface QuestionPage {
  name: string;
  key: string;
  questions: Question[];
}

export interface Question {
  label: string;
  key: string;
  value?: string;
  imageUrl?: string;
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
}

export interface InspectionFormWithId extends InspectionForm {
  id: string;
}

export const useAddNewInspectionForm = (inspectionRequestId: string, userId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inspectionForm: InspectionForm): Promise<void> => {
      // Add a reference to the inspectionRequestDoc and userDoc in the inspectionForm
      const inspectionRequestDoc = doc(db, InspectionRequestsCollection, inspectionRequestId);
      const userDoc = doc(db, UsersCollection, userId);
      const inspectionFormWithReferences = {
        ...inspectionForm,
        inspectionRequestRef: inspectionRequestDoc,
        userRef: userDoc,
        reportStatus: InspectionReportStatus.FilledForm,
      };

      // update the inspection request status to "Inspection Form Created" when the inspection form is created
      await runTransaction(db, async (transaction) => {
        const inspectionRequestDocSnap = await transaction.get(inspectionRequestDoc);
        if (!inspectionRequestDocSnap.exists()) {
          throw "Inspection Request does not exist!";
        }

        const inspectionRequest = inspectionRequestDocSnap.data();
        if (inspectionRequest.reportStatus === InspectionReportStatus.FilledForm) {
          throw "Inspection Request status is not filled!";
        }

        transaction.update(inspectionRequestDoc, {
          reportStatus: InspectionReportStatus.FilledForm,
        });
      });

      await addDoc(collection(db, InspectionFormsCollection), inspectionFormWithReferences);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionFormsCollection]);
        queryClient.refetchQueries([InspectionFormsCollection]);
      },
    }
  );
};

export const useGetInspectionFormByType = (equipmentType: string) => {
  return useQuery<InspectionFormWithId[], Error>(
    [InspectionFormsCollection, "inspection-forms", equipmentType],
    async () => {
      const q = query(
        collection(db, InspectionFormsCollection),
        where("type", "==", equipmentType)
        // where("reportStatus", "==", InspectionReportStatus.Approved)
      );
      const snapshot = await getDocs(q);

      const createdByUserUids = snapshot.docs.map((doc) => doc.data().createdByUserUid);

      // Fetch user data using a single query
      const userQuery = query(collection(db, UsersCollection), where("user_id", "in", createdByUserUids));
      const userSnapshot = await getDocs(userQuery);

      // Create a map of users by UID for efficient lookup
      const userMap = new Map();
      userSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        userMap.set(userData.user_id, userData);
      });

      // Map the QueryDocumentSnapshot objects to InspectionForm objects
      const inspectionForms: InspectionFormWithId[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdByUserUid = data.createdByUserUid;
        const createdByUser = userMap.get(createdByUserUid);

        return {
          type: data.type,
          createdByUserUid: createdByUserUid,
          form: data.form,
          createdByUser: createdByUser,
          id: doc.id,
        };
      });

      return inspectionForms;
    }
  );
};

export const useGetInspectionFormById = (id: string) => {
  return useQuery<InspectionForm, Error>([InspectionFormsCollection, "inspection-forms"], async () => {
    const docRef = doc(db, InspectionFormsCollection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const createdByUserUid = data.createdByUserUid;

      const userDocRef = doc(db, UsersCollection, createdByUserUid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const createdByUser = userDocSnap.data() as UserWithId; // Cast the user document to UserWithId type

        return {
          type: data.name,
          createdByUserUid: createdByUserUid,
          form: data.form,
          createdByUser: createdByUser as UserWithId, // Cast the createdByUser property to UserWithId type
        };
      } else {
        throw new Error("User does not exist");
      }
    } else {
      throw new Error("Inspection form does not exist");
    }
  });
};

export const useGetInspectionFormsByStatus = (status: string) => {
  return useQuery<InspectionFormWithId[], Error>([InspectionFormsCollection, "inspection-forms", status], async () => {
    const q = query(
      collection(db, InspectionFormsCollection),
      where("reportStatus", "==", status),
      where("reportStatus", "==", status)
    );
    const snapshot = await getDocs(q);

    const createdByUserUids = snapshot.docs.map((doc) => doc.data().createdByUserUid);

    // Fetch user data using a single query
    const userQuery = query(collection(db, UsersCollection), where("user_id", "in", createdByUserUids));
    const userSnapshot = await getDocs(userQuery);

    // Create a map of users by UID for efficient lookup
    const userMap = new Map();
    userSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      userMap.set(userData.user_id, userData);
    });

    // Map the QueryDocumentSnapshot objects to InspectionForm objects
    const inspectionForms: InspectionFormWithId[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdByUserUid = data.createdByUserUid;
      const createdByUser = userMap.get(createdByUserUid);

      return {
        type: data.type,
        createdByUserUid: createdByUserUid,
        form: data.form,
        createdByUser: createdByUser,
        id: doc.id,
        reportStatus: data.reportStatus,
      };
    });

    return inspectionForms;
  });
};

export const useUpdateInspectionFormStatus = (status: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inspectionFormId: string): Promise<void> => {
      await runTransaction(db, async (transaction) => {
        const inspectionFormDocRef = doc(db, InspectionFormsCollection, inspectionFormId);
        const inspectionFormDocSnap = await transaction.get(inspectionFormDocRef);
        if (!inspectionFormDocSnap.exists()) {
          throw "Inspection Form does not exist!";
        }

        const inspectionForm = inspectionFormDocSnap.data();
        if (
          inspectionForm.reportStatus === InspectionReportStatus.Approved ||
          inspectionForm.reportStatus === InspectionReportStatus.Rejected
        ) {
          throw "Inspection Form status is not pending!";
        }

        const inspectionRequestDocRef = inspectionForm.inspectionRequestRef;
        const inspectionRequestDocSnap = await transaction.get(inspectionRequestDocRef);
        if (!inspectionRequestDocSnap.exists()) {
          throw "Inspection Request does not exist!";
        }

        const inspectionRequest = inspectionRequestDocSnap.data() as InspectionRequestObject;
        if (
          inspectionRequest.reportStatus === InspectionReportStatus.Approved ||
          inspectionRequest.reportStatus === InspectionReportStatus.Rejected
        ) {
          throw "Inspection Request status is not pending!";
        }

        // All read operations have been completed; now, perform the write operations
        transaction.update(inspectionFormDocRef, {
          reportStatus: status,
        });

        transaction.update(inspectionRequestDocRef, {
          reportStatus: InspectionReportStatus.Approved,
          step: Step.Complete,
        });
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionFormsCollection]);
        queryClient.refetchQueries([InspectionFormsCollection]);
      },
      onError: (error: any) => {
        notifications.show({
          message: <div>{error}</div>,
          color: "red",
        });
      },
    }
  );
};
