import type { QuestionPage } from "./forms.shared";

export const equipmentTypesCollection = "equipment-types";
export const equipmentManufacturersCollection = "equipment-manufacturers";
export const equipmentTypeManufacturersCollection =
  "equipment-type-manufacturers";
export const equipmentModelsCollection = "models"; //equipment-models
export const equipmentSectionsCollection = "equipment-sections";
export const equipmentSectionQuestionsCollection = "questions";

export type EquipmentMetadata = {
  id?: string;
  code: EquipmentType | EquipmentManufacturer | string;
  label: string;
  slug?: string;
  supported?: boolean;
};

export type EquipmentTypeManufacturerDto = {
  manufacturer_id: string;
  type_id: string;
};

export type EquipmentSection = QuestionPage;

export type EquipmentSectionDto = {
  equipmentType: EquipmentMetadata;
  manufacturer?: EquipmentMetadata;
  model?: EquipmentMetadata;
  data: EquipmentSection[];
};

export enum EquipmentManufacturer {
  CAT = "Caterpillar",
  KOMATSU = "Komatsu",
  DEERE = "John Deere",
  BOBCAT = "Bobcat",
  VOLVO = "Volvo",
  JCB = "JCB",
  CASE = "Case",
  HITACHI = "Hitachi",
  HYUNDAI = "Hyundai",
  KOBELCO = "Kobelco",
  DOOSAN = "Doosan",
  KUBOTA = "Kubota",
  NEW_HOLLAND = "New Holland",
  TAKEUCHI = "Takeuchi",
  TEREX = "Terex",
  YANMAR = "Yanmar",
  SANY = "Sany",
  LIEBHERR = "Liebherr",
  SDLG = "SDLG",
  XCMG = "XCMG",
  VOLVO_CE = "Volvo CE",
  ATLAS = "Atlas",
  CASE_CE = "Case CE",
  CATERPILLAR_CE = "Caterpillar CE",
  HITACHI_CE = "Hitachi CE",
  HYUNDAI_CE = "Hyundai CE",
  JCB_CE = "JCB CE",
  KOBELCO_CE = "Kobelco CE",
  KOMATSU_CE = "Komatsu CE",
  LIEBHERR_CE = "Liebherr CE",
  NEW_HOLLAND_CE = "New Holland CE",
  SANY_CE = "Sany CE",
  TAKEUCHI_CE = "Takeuchi CE",
  TEREX_CE = "Terex CE",
  YANMAR_CE = "Yanmar CE",
}

export enum EquipmentType {
  Backhoe = "Backhoe",
  CompactLoaders = "Compact Loaders",
  Dozers = "Dozers",
  WheelLoaders = "Wheel Loaders",
  Excavators = "Excavators",
  MiniExcavators = "Mini Excavators",
  CompactExcavator = "Compact Excavator",
  Skidsteers = "Skidsteers",
  Telehandlers = "Telehandlers",
  MotorGraders = "Motor Graders",
}
