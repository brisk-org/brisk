import { registerEnumType } from "type-graphql";

export enum PerDay {
  BID = "BID",
  STAT = "STAT",
}

registerEnumType(PerDay, {
  name: "PerDay",
});
