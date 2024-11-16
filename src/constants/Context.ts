import { Request, Response } from "express";
import { Connection } from "typeorm";
import { PubSub } from "graphql-yoga";
import { Card } from "src/entities/Card";
import { Notification } from "src/entities/Notification";
import {
  DELETE_NOTIFICATION,
  NEW_CARD_CREATED,
  NEW_CREATE_LABORATORY_TEST,
  NEW_CREATE_PRESCRIPTION,
  NEW_CREATE_QUICK_PRESCRIPTION,
  NEW_NOTIFICATION,
} from "./subscriptionTriggername";
import { QuickPrescription } from "src/entities/QuickPrescription";
import { LaboratoryExamination } from "src/entities/LaboratoryExamination";
import { Prescription } from "src/entities/Prescription";

export interface Req extends Request {
  user: {
    id: number;
    occupation: string;
    username: string;
  };
}
interface Context {
  connection: Connection;
  req: Req;
  res: Response;
  pubsub: PubSub<{
    [NEW_CARD_CREATED]: [{ card: Card }];
    [NEW_NOTIFICATION]: [{ notification: Notification }];
    [DELETE_NOTIFICATION]: [{ notification: Notification }];
    [NEW_CREATE_QUICK_PRESCRIPTION]: [
      { quickPrescriptionTest: QuickPrescription },
    ];
    [NEW_CREATE_LABORATORY_TEST]: [
      {
        laboratoryTest: LaboratoryExamination;
      },
    ];
    [NEW_CREATE_PRESCRIPTION]: [
      {
        prescription: Prescription;
      },
    ];
  }>;
}
export default Context;
