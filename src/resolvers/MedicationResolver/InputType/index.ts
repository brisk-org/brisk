import { PerDay } from "../../../utils/EnumTypes";
import { Field, ID, ArgsType, InputType } from "type-graphql";

@InputType()
export class CheckInStatusInput {
  @Field()
  isPaid: boolean;
  @Field()
  isCompleted: boolean;
}
@InputType()
export class CheckInInput {
  @Field()
  date: string;
  @Field()
  price: number;
  @Field(() => [CheckInStatusInput])
  status: CheckInStatusInput[];
}

@ArgsType()
export class CreatePrescriptionMedicationArgs {
  @Field(() => ID!)
  medicineId: string;
  @Field(() => ID!)
  prescriptionId: string;
  @Field({ nullable: true })
  strength?: string;
  @Field(() => PerDay)
  perDay: string;
  @Field(() => [CheckInInput], {
    description: "getting this array from the client and stringify it ",
  })
  checkIn: CheckInInput[];
  @Field()
  forDays: number;
  @Field(() => String, { nullable: true })
  other?: string;
}

// @InputType()
// export class UpdatePrescriptionTestInput {
//   @Field(() => ID!)
//   id: number;

//   @Field()
//   done: boolean;

//   @Field(() => [PrescriptionInput])
//   result: string;
// }
