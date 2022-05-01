import { EntitySchema } from "typeorm";
import { User } from "./User";
import { Card } from "./Card";
import { LaboratoryTest } from "./LaboratoryTest";
import { History } from "./History";
import { Settings } from "./Settings";
import { CardSales } from "./CardSales";
import { PrescriptionTest } from "./PrescriptionTest";
import { QuickPrescriptionTest } from "./QuickPrescriptionTest";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";
import { Notification } from "./Notification";
import { Product } from "./Product";

export default [
  User,
  Card,
  LaboratoryTest,
  History,
  PrescriptionTest,
  Settings,
  Product,
  CardSales,
  QuickPrescriptionTest,
  QuickLaboratoryTest,
  Notification,
] as (string | Function | EntitySchema<any>)[] | undefined;
