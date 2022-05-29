import { registerEnumType } from "type-graphql";

export enum PerDay {
  BID = "BID",
  STAT = "STAT",
}
export enum Occupation {
  ADMIN = "ADMIN",
  RECEPTION = "RECEPTION",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  LABORATORY = "LABORATORY",
}

registerEnumType(PerDay, {
  name: "PerDay",
});
registerEnumType(Occupation, {
  name: "Occupation",
});
