import { PerDay } from "../../../utils/EnumTypes";
import { Field, ID, ArgsType, InputType } from "type-graphql";

@InputType()
export class CheckIn {
  @Field()
  date: string;
  @Field()
  isPaid: boolean;
  @Field()
  isCompleted: boolean;
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
  @Field(() => [CheckIn], {
    description: "getting this array from the client and stringify it ",
  })
  checkIn: CheckIn[];
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
