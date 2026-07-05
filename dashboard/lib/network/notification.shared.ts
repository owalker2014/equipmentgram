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
