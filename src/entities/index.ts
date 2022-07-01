import { EntitySchema } from "typeorm";
import { User } from "./User";
import { Card } from "./Card";
import { LaboratoryExamination } from "./LaboratoryExamination";
import { History } from "./History";
import { Settings } from "./Settings";
import { CardSales } from "./CardSales";
import { Prescription } from "./Prescription";
import { QuickPrescription } from "./QuickPrescription";
import { QuickLaboratoryExamination } from "./QuickLaboratoryExamination";
import { Notification } from "./Notification";
import { Medication } from "./Medication";
import { Medicine } from "./Medicine";
import { LaboratoryTest } from "./LaboratoryTest";
import { LaboratoryTestCategory } from "./LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "./LaboratoryTestSubCategory";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";
import { QuickMedicine } from "./QuickMedicine";

export default [
  User,
  Card,
  LaboratoryExamination,
  LaboratoryTest,
  LaboratoryTestCategory,
  LaboratoryTestSubCategory,
  History,
  Prescription,
  Medication,
  Medicine,
  Settings,
  CardSales,
  QuickPrescription,
  QuickLaboratoryExamination,
  QuickLaboratoryTest,
  QuickMedicine,
  Notification,
] as (string | Function | EntitySchema<any>)[] | undefined;
