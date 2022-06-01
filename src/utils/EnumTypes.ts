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

export enum NotificationAction {
  PAYMENT = "create",
  CREATE = "create",
  MARK_AS_NEW = "mark_as_new",
  COMPLETE = "complete",
  CHECK_IN = "check_in",
}

registerEnumType(PerDay, {
  name: "PerDay",
});
registerEnumType(Occupation, {
  name: "Occupation",
});
registerEnumType(NotificationAction, {
  name: "NotificationAction",
});
