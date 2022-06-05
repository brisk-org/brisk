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
class LaboratoryTestRequestInput {
  @Field()
  value: string;

  @Field()
  laboratoryTestId: string;
}

@InputType()
export class CreateLaboratoryTestInput {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  price: number;

  @Field(() => [LaboratoryTestRequestInput])
  laboratoryTestRequest!: LaboratoryTestRequestInput[];
}
