import { InputType, Field, ID, ArgsType } from "type-graphql";

@ArgsType()
export class CreatePrescriptionArgs {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  totalPrice: number;

  @Field()
  rx: string;
}

@InputType()
export class UpdatePrescriptionTestInput {
  @Field(() => ID!)
  id: number;

  @Field()
  done: boolean;
}
