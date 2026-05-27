import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationsCollection = "notifications";

export interface Notification {
  message: string;
  icon: string;
  click_action: string;
  type: NotificationType;
  from: string;
  to: string;
}

export enum NotificationType {
  Report = "report",
  Message = "message",
  Inspection = "inspection",
  InspectionResponse = "inspection-response",
}

export const useAddNewNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (notification: Notification): Promise<void> => {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([notificationsCollection]);
        queryClient.refetchQueries([notificationsCollection]);
      },
    },
  );
};

export const useGetNotification = (email: string) => {
  return useQuery<Notification[], Error>(
    [notificationsCollection, email],
    async () => {
      const res = await fetch(
        `/api/notifications?email=${encodeURIComponent(email)}`,
      );
      return res.json();
    },
  );
};
