import { Request, Response } from "express";
import { Connection } from "typeorm";
import { PubSub } from "graphql-subscriptions";

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
  pubsub: PubSub;
};
export default Context;
