import type { UserWithId } from "./users";

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
  required?: boolean;
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
}

export interface InspectionFormWithId extends InspectionForm {
  id: string;
}
