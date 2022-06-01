import { Field, ID, ArgsType } from "type-graphql";

@ArgsType()
export class CreatePrescriptionArgs {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  price: number;

  @Field()
  rx: string;
}
