import { EntitySchema } from "typeorm";
import { User } from "./User";
import { Card } from "./Card";
import { LaboratoryTest } from "./LaboratoryTest";
import { History } from "./History";
import { Settings } from "./Settings";
import { CardSales } from "./CardSales";
import { Prescription } from "./Prescription";
import { QuickPrescriptionTest } from "./QuickPrescriptionTest";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";
import { Notification } from "./Notification";

export default [
  User,
  Card,
  LaboratoryTest,
  History,
  Prescription,
  Settings,
  CardSales,
  QuickPrescriptionTest,
  QuickLaboratoryTest,
  Notification,
] as (string | Function | EntitySchema<any>)[] | undefined;
