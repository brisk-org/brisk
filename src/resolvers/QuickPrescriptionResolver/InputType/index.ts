import { InputType, Field, ID } from "type-graphql";

@InputType()
export class CreateQuickPrescriptionTestInput {
  @Field()
  name!: string;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => [ID])
  medicineIds: number[];

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
