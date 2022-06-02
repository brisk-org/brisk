import { Field, InputType } from "type-graphql";

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

// @InputType()
// export class UpdatePrescriptionTestInput {
//   @Field(() => ID!)
//   id: number;

//   @Field()
//   done: boolean;

//   @Field(() => [PrescriptionInput])
//   result: string;
// }
