import { InputType, Field } from "type-graphql";

@InputType()
class QuickPrescriptionTestResults {
  @Field()
  bp!: boolean;

  @Field()
  dressing!: boolean;

  @Field()
  injection!: boolean;

  @Field()
  tat!: boolean;

  @Field()
  depo!: boolean;

  @Field(() => String, { nullable: true })
  other?: string;
}

@InputType()
export class CreateQuickPrescriptionTestInput {
  @Field()
  name!: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => QuickPrescriptionTestResults)
  result!: string;

  @Field(() => String, { nullable: true })
  other?: string;
}

@InputType()
export class CompleteQuickPrescriptionTestInput {
  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  other?: string;
}
