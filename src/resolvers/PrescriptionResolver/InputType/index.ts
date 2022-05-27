import { InputType, Field, ID } from "type-graphql";

@InputType()
export class PrescriptionInput {
  @Field()
  name: string;
  @Field()
  price: number;
  @Field()
  inStock: number;
  @Field({ nullable: true })
  strength?: string;
  @Field()
  perDay: string;
  @Field()
  checkIn: string;
  @Field()
  forDays: number;
  @Field(() => String, { nullable: true })
  other: string;
}

@InputType()
export class CreatePrescriptionTestInput {
  @Field(() => ID!)
  cardId!: number;

  @Field()
  price!: number;

  @Field(() => [PrescriptionInput])
  result!: string;
}

@InputType()
export class UpdatePrescriptionTestInput {
  @Field(() => ID!)
  id: number;

  @Field()
  done: boolean;

  @Field(() => [PrescriptionInput])
  result: string;
}
