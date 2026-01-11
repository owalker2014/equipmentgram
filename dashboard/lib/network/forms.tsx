import {
  addDoc,
  collection,
  QueryConstraint,
} from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DocumentReference,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig/init";
import { UserWithId, usersCollection } from "./users";
import { DocumentData } from "firebase-admin/firestore";
import { useRouter } from "next/navigation";
import { inspectionRequestsCollection } from "./inspection-requests";
import { notify } from "../utils";

export const inspectionFormsCollection = "inspection-forms";


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

export interface InspectionFormWithId extends InspectionForm {
  id: string;
}

export const useAddNewInspectionForm = (
  inspectionRequestId: string,
  userId: string
) => {
  const queryClient = useQueryClient();
  const navigation = useRouter();

  return useMutation(
    async (inspectionForm: InspectionForm): Promise<void> => {
      // Add a reference to the inspectionRequestDoc and userDoc in the inspectionForm

      // update the inspection request status to "Inspection Form Created" when the inspection form is created
      await runTransaction(db, async (transaction) => {
        const inspectionRequestDoc = doc(
          db,
          inspectionRequestsCollection,
          inspectionRequestId
        );
        const userDoc = doc(db, usersCollection, userId);

        const inspectionRequestDocSnap = await transaction.get(
          inspectionRequestDoc
        );
        if (!inspectionRequestDocSnap.exists()) {
          throw new Error("Inspection Request does not exist!");
        }

        const inspectionRequest = inspectionRequestDocSnap.data();

        transaction.update(inspectionRequestDoc, {
          reportStatus: InspectionReportStatus.FilledForm,
        });

        const requestedByUserDoc = doc(
          db,
          usersCollection,
          inspectionRequest.user_id
        );

        const inspectionFormWithReferences = {
          ...inspectionForm,
          inspectionRequestRef: inspectionRequestDoc,
          userRef: userDoc,
          reportStatus: InspectionReportStatus.FilledForm,
          requestedByUserRef: requestedByUserDoc,
          requestedByUserId: inspectionRequestDocSnap.data().user_id,
        };

        await addDoc(
          collection(db, inspectionFormsCollection),
          inspectionFormWithReferences
        );
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([inspectionFormsCollection]);
        queryClient.refetchQueries([inspectionFormsCollection]);
        navigation.push("/forms");
      },
      onError: (error: any) => {
        notify(
          {
            title: "Inspection Submission Error",
            message:
              error.message ??
              "Error creating inspection form. Please try again later.",
          },
          true
        );
      },
    }
  );
};

export const useGetInspectionFormByType = (
  userId: string,
  equipmentType?: string,
  isCustomer?: boolean
) => {
  return useQuery<InspectionFormWithId[], Error>(
    [inspectionFormsCollection, "inspection-forms", equipmentType],
    async () => {
      const conditions: QueryConstraint[] = [];
      if (equipmentType) {
        conditions.push(where("type", "==", equipmentType));
      }

      if (isCustomer) {
        conditions.push(
          ...[
            // approved form or all forms if customer
            where("reportStatus", "==", InspectionReportStatus.Approved),
            where("requestedByUserId", "==", userId),
          ]
        );
      } else {
        conditions.push(
          ...[
            where("reportStatus", "in", [
              InspectionReportStatus.Approved,
              InspectionReportStatus.FilledForm,
              InspectionReportStatus.Rejected,
              InspectionReportStatus.Pending,
            ]),
            where("createdByUserUid", "==", userId),
          ]
        );
      }
      // conditions.push(orderBy("timestamp", "desc"));
      const q = query(collection(db, inspectionFormsCollection), ...conditions);

      const snapshot = await getDocs(q);
      const createdByUserUids = snapshot.docs.map(
        (doc) => doc.data().createdByUserUid
      );

      // Fetch user data using a single query
      const userQuery = query(
        collection(db, usersCollection),
        where("user_id", "in", createdByUserUids)
      );
      const userSnapshot = await getDocs(userQuery);

      // Create a map of users by UID for efficient lookup
      const userMap = new Map();
      userSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        userMap.set(userData.user_id, userData);
      });

      // Map the QueryDocumentSnapshot objects to InspectionForm objects
      const inspectionForms: InspectionFormWithId[] = snapshot.docs.map(
        (doc) => {
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
        }
      );

      return inspectionForms;
    }
  );
};

export const useGetInspectionFormById = (id: string) => {
  return useQuery<InspectionFormWithId, Error>(
    [inspectionFormsCollection, "inspection-forms"],
    async () => {
      const docRef = doc(db, inspectionFormsCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const createdByUserUid = data.createdByUserUid;

        const userDocRef = doc(db, usersCollection, createdByUserUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const createdByUser = userDocSnap.data() as UserWithId; // Cast the user document to UserWithId type

          return {
            id: data.id,
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
    }
  );
};
