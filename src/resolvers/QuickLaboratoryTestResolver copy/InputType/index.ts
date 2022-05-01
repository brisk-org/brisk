import { InputType, Field } from "type-graphql";

@InputType()
export class CreateQuickLabTestInput {
  @Field()
  name!: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field()
  result: string;

  @Field(() => String, { nullable: true })
  other?: string;
}
@InputType()
export class CompleteQuickLabTestInput {
  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  other?: string;
}
