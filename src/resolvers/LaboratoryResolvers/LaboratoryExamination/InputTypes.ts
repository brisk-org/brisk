import { InputType, Field, ID, ArgsType } from "type-graphql";

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
class LaboratoryTestIdInput {
  @Field()
  id: string;
}

@ArgsType()
export class CreateLaboratoryExaminationArgs {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  price: number;

  @Field(() => [LaboratoryTestIdInput])
  laboratoryTest: LaboratoryTestIdInput[];

  @Field(() => [ID], { nullable: true })
  selectedCategories?: string[];

  @Field(() => [ID], { nullable: true })
  selectedSubCategories?: string[];
}

@InputType()
export class CompleteLaboratoryExaminationInput {
  @Field(() => ID!)
  id: string;
  @Field()
  value: string;
}
