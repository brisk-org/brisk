import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./UserResolver";
import {
  LaboratoryExaminationResolver,
  LaboratoryTestRequestResolver,
  LaboratoryTestCategoryResolver,
  LaboratoryTestResolver,
  LaboratoryTestSubCategoryResolver,
} from "./LaboratoryResolvers";
import { SettingsResolver } from "./SettingsResolver";
import { CardsResolver } from "./CardResolver";
import { MedicineResolver } from "./MedicineResolver";
import { CardSalesResolver } from "./CardSalesResolver";
import { HistoryResolver } from "./HistoryResolver";
import { PrescriptionResolver } from "./PrescriptionResolver";
import { MedicationResolver } from "./MedicationResolver";
import { QuickPrescriptionResolver } from "./QuickPrescriptionResolver";
import { QuickLaboratoryExaminationResolver } from "./QuickLaboratoryExaminationResolver";
import { QuickLaboratoryTestResolver } from "./QuickLaboratoryTestResolver";
import { QuickMedicineResolver } from "./QuickMedicineResolver";
import { NotificationResolver } from "./NotificationResolver";

export default [
  UserResolver,
  MedicineResolver,
  LaboratoryExaminationResolver,
  LaboratoryTestCategoryResolver,
  LaboratoryTestRequestResolver,
  LaboratoryTestResolver,
  LaboratoryTestSubCategoryResolver,
  SettingsResolver,
  CardsResolver,
  CardSalesResolver,
  HistoryResolver,
  MedicationResolver,
  PrescriptionResolver,
  QuickPrescriptionResolver,
  QuickLaboratoryExaminationResolver,
  NotificationResolver,
  QuickLaboratoryTestResolver,
  QuickMedicineResolver,
] as NonEmptyArray<Function> | NonEmptyArray<string>;
