import { InspectionReportStatus } from "./forms.shared";
import { EquipmentManufacturer, EquipmentType } from "./equipment.shared";

export const inspectionRequestsCollection = "inspection-requests";

export enum Step {
  Request = "Request",
  Schedule = "Schedule",
  Inspection = "Inspection",
  Results = "Results",
  Complete = "Complete",
}

export type InspectionRequestObject = {
  user_id: string;
  inspectorRef: unknown;
  inspectorId?: string;
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
  created?: unknown;
  canceled: boolean;
  reportStatus: InspectionReportStatus;
};

export type InspectionRequestObjectWithId = Partial<InspectionRequestObject> & {
  id: string;
};
