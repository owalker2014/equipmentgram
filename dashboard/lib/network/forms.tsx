import { addDoc, collection } from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentReference, doc, getDoc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { db } from "../firebaseConfig/init";
import { UserWithId, UsersCollection } from "./users";
import { DocumentData } from "firebase-admin/firestore";
import { useRouter } from "next/navigation";
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
  inspectorName?: string;
}
export interface QuestionPage {
  name: string;
  comment?: string;
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
  requestedByUserRef?: DocumentReference<DocumentData>;
  requestedByUserId?: string;
  userRef?: DocumentReference<DocumentData>;
  inspectionRequestRef?: DocumentReference<DocumentData>;
}

export const useAddNewInspectionForm = (inspectionRequestId: string, userId: string) => {
  const queryClient = useQueryClient();
  const navigation = useRouter();

  return useMutation(
    async (inspectionForm: InspectionForm): Promise<void> => {
      // Add a reference to the inspectionRequestDoc and userDoc in the inspectionForm

      // update the inspection request status to "Inspection Form Created" when the inspection form is created
      await runTransaction(db, async (transaction) => {
        const inspectionRequestDoc = doc(db, InspectionRequestsCollection, inspectionRequestId);
        const userDoc = doc(db, UsersCollection, userId);

        const inspectionRequestDocSnap = await transaction.get(inspectionRequestDoc);
        if (!inspectionRequestDocSnap.exists()) {
          throw "Inspection Request does not exist!";
        }

        const inspectionRequest = inspectionRequestDocSnap.data();

        transaction.update(inspectionRequestDoc, {
          reportStatus: InspectionReportStatus.FilledForm,
        });

        const requestedByUserDoc = doc(db, UsersCollection, inspectionRequest.user_id);

        const inspectionFormWithReferences = {
          ...inspectionForm,
          inspectionRequestRef: inspectionRequestDoc,
          userRef: userDoc,
          reportStatus: InspectionReportStatus.FilledForm,
          requestedByUserRef: requestedByUserDoc,
          requestedByUserId: inspectionRequestDocSnap.data().user_id,
        };

        await addDoc(collection(db, InspectionFormsCollection), inspectionFormWithReferences);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([InspectionFormsCollection]);
        queryClient.refetchQueries([InspectionFormsCollection]);
        navigation.push("/forms");
      },
      onError: (error) => {
        notifications.show({
          message: "Error creating inspection form. Please try again later.",
          color: "red",
        });
      },
    }
  );
};

export interface InspectionFormWithId extends InspectionForm {
  id: string;
}

export const useGetInspectionFormByType = (equipmentType: string, userId: string, isCustomer?: boolean) => {
  return useQuery<InspectionFormWithId[], Error>(
    [InspectionFormsCollection, "inspection-forms", equipmentType],
    async () => {
      const q = query(
        collection(db, InspectionFormsCollection),
        where("type", "==", equipmentType),
        // approved form or all forms if customer
        !isCustomer
          ? where("reportStatus", "in", [
              InspectionReportStatus.Approved,
              InspectionReportStatus.FilledForm,
              InspectionReportStatus.Rejected,
              InspectionReportStatus.Pending,
            ])
          : where("reportStatus", "==", InspectionReportStatus.Approved),
        isCustomer ? where("requestedByUserId", "==", userId) : where("createdByUserUid", "==", userId)
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
          requestedByUserRef: data.requestedByUserRef,
          requestedByUserId: data.requestedByUserId,
          userRef: data.userRef,
          inspectionRequestRef: data.inspectionRequestRef,
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
          type: data.type,
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
