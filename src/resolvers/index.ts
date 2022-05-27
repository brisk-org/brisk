import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { LaboratoryTestResolver } from "./LaboratoryTestResolver";
import { SettingsResolver } from "./SettingsResolver";
import { CardsResolver } from "./CardResolver";
import { CardSalesResolver } from "./CardSalesResolver";
import { HistoryResolver } from "./HistoryResolver";
import { PrescriptionResolver } from "./PrescriptionResolver";
import { QuickPrescriptionResolver } from "./QuickPrescriptionTestResolver";
import { QuickLaboratoryTestResolver } from "./QuickLaboratoryTestResolver";
import { NotificationResolver } from "./NotificationResolver";

export default [
  UserResolver,
  LaboratoryTestResolver,
  SettingsResolver,
  CardsResolver,
  CardSalesResolver,
  HistoryResolver,
  PrescriptionResolver,
  QuickPrescriptionResolver,
  QuickLaboratoryTestResolver,
  NotificationResolver,
] as NonEmptyArray<Function> | NonEmptyArray<string>;
