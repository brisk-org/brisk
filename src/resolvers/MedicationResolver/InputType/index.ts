import { Field, InputType } from "type-graphql";

@InputType()
export class CheckInStatusInput {
  @Field()
  isPaid: boolean;
  @Field()
  isCompleted: boolean;
}
@InputType()
class CheckInInput {
  @Field()
  date: string;
  @Field()
  price: number;
  @Field(() => [CheckInStatusInput])
  status: CheckInStatusInput[];
}

@InputType()
export class MedicationsCheckInInput {
  @Field()
  name: string;

  @Field(() => [CheckInInput])
  checkIn: CheckInInput[];
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
