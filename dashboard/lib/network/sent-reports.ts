import { addDoc, collection } from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebaseConfig/init";
import { InspectionForm, InspectionFormWithId } from "./forms";
import { getDocs, query, where } from "firebase/firestore";
import { NotificationCollection, NotificationType } from "./notification";
import { useAuth } from "../authContext";

export const sentReportCollection = "sent-reports";

export interface SentReport extends InspectionFormWithId {
  sentTo: string;
  inspectionFormId: string;
}

export const useAddNewSentReport = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation(
    async (sentReport: SentReport): Promise<void> => {
      await addDoc(collection(db, NotificationCollection), {
        message: `${user?.displayName} has sent you a report`,
        type: NotificationType.Report,
        from: user?.email,
        to: sentReport.sentTo,
      });
      await addDoc(collection(db, sentReportCollection), sentReport);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([sentReportCollection]);
        queryClient.refetchQueries([sentReportCollection]);
      },
    }
  );
};

export const useGetSentReports = (equipmentType?: string) => {
  return useQuery<SentReport[], Error>(
    [sentReportCollection, "sent-reports", equipmentType],
    async () => {
      let q = query(collection(db, sentReportCollection));
      if (equipmentType) {
        q = query(q, where("type", "==", equipmentType));
      }

      const querySnapshot = await getDocs(q);
      const sentReports: SentReport[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sentReport: SentReport = {
          type: data.type,
          form: data.form,
          sentTo: data.sentTo,
          createdByUserUid: data.createdByUserUid,
          createdByUser: data.createdByUser,
          id: data.inspectionFormId,
          inspectionFormId: data.inspectionFormId,
        };

        sentReports.push(sentReport);
      });

      return sentReports;
    }
  );
};
