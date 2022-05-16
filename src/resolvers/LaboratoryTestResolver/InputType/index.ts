import { InputType, Field, ID } from "type-graphql";

@InputType()
export class LaboratoryTestInput {
  @Field()
  name: string;
  @Field()
  value: string;
}
@InputType()
export class LaboratorySubCategoryInput {
  @Field()
  name: string;
  @Field(() => [LaboratoryTestInput])
  tests: string;
}

@InputType()
export class LaboratoryTestResult {
  @Field()
  name: string;
  @Field(() => [LaboratorySubCategoryInput], { nullable: true })
  subCategories?: string;
  @Field(() => [LaboratoryTestInput], { nullable: true })
  tests?: string;
}

@InputType()
export class CreateLaboratoryTestInput {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  totalPrice!: number;

  @Field(() => [LaboratoryTestResult])
  result!: string;
}
