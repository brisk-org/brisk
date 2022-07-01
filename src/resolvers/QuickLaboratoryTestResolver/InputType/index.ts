import { InputType, Field, Float, ID } from "type-graphql";

@InputType()
export class CreateQuickLabTestInput {
  @Field()
  name!: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => [ID])
  testIds: number[];

  @Field(() => String, { nullable: true })
  other?: string;
}
@InputType()
export class CompleteQuickLabTestInput {
  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  other?: string;
}
