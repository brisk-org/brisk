import { InputType, Field, Float, ID } from "type-graphql";
import { QuickLaboratoryExaminationResult } from "../../../utils/EnumTypes";

@InputType()
export class CreateQuickLabTestInput {
  @Field()
  name!: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => [ID])
  testIds: number[];

  @Field(() => QuickLaboratoryExaminationResult, { nullable: true })
  result: QuickLaboratoryExaminationResult;

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
