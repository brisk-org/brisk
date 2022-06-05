import { EntitySchema } from "typeorm";
import { User } from "./User";
import { Card } from "./Card";
import { LaboratoryExamination } from "./LaboratoryExamination";
import { History } from "./History";
import { Settings } from "./Settings";
import { CardSales } from "./CardSales";
import { Prescription } from "./Prescription";
import { QuickPrescriptionTest } from "./QuickPrescriptionTest";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";
import { Notification } from "./Notification";
import { Medication } from "./Medication";
import { Medicine } from "./Medicine";
import { LaboratoryTest } from "./LaboratoryTest";
import { LaboratoryTestCategory } from "./LaboratoryTestCategory";
import { LaboratoryTestRequest } from "./LaboratoryTestRequest";
import { LaboratoryTestSubCategory } from "./LaboratoryTestSubCategory";

export default [
  User,
  Card,
  LaboratoryExamination,
  LaboratoryTest,
  LaboratoryTestCategory,
  LaboratoryTestRequest,
  LaboratoryTestSubCategory,
  History,
  Prescription,
  Medication,
  Medicine,
  Settings,
  CardSales,
  QuickPrescriptionTest,
  QuickLaboratoryTest,
  Notification,
] as (string | Function | EntitySchema<any>)[] | undefined;
