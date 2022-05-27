import { InputType, Field, ID } from "type-graphql";

@InputType()
export class CreateMedicineInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  inStock: number;
}

@InputType()
export class UpdateMedicineInput extends CreateMedicineInput {
  @Field(() => ID!)
  id: number;
}
