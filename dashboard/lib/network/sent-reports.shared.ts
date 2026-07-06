import type { InspectionFormWithId } from "./forms.shared";

export const sentReportsCollection = "sent-reports";

export interface SentReport extends InspectionFormWithId {
  sentTo: string;
  inspectionFormId: string;
}
