import { InputType, Field, ID } from "type-graphql";

@InputType()
export class LaboratoryTestInput {
  @Field()
  name: string;
  @Field()
  category: string;
  @Field(() => String, { nullable: true })
  value?: string;
}

@InputType()
export class CreateLaboratoryTestInput {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  price!: number;

  @Field(() => [LaboratoryTestInput])
  result!: string;
}
