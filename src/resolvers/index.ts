import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./UserResolver";
import {
  LaboratoryExaminationResolver,
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
import { QuickPrescriptionResolver } from "./QuickPrescriptionTestResolver";
import { QuickLaboratoryTestResolver } from "./QuickLaboratoryTestResolver";
import { NotificationResolver } from "./NotificationResolver";

export default [
  UserResolver,
  MedicineResolver,
  LaboratoryExaminationResolver,
  LaboratoryTestCategoryResolver,
  LaboratoryTestResolver,
  LaboratoryTestSubCategoryResolver,
  SettingsResolver,
  CardsResolver,
  CardSalesResolver,
  HistoryResolver,
  MedicationResolver,
  PrescriptionResolver,
  QuickPrescriptionResolver,
  QuickLaboratoryTestResolver,
  NotificationResolver,
] as NonEmptyArray<Function> | NonEmptyArray<string>;
