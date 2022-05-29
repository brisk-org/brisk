import { PerDay } from "../../../utils/EnumTypes";
import { Field, ID, ArgsType } from "type-graphql";

@ArgsType()
export class CreateMedicineInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  inStock: number;
  @Field({ nullable: true })
  forDays?: number;

  @Field(() => PerDay, { nullable: true })
  perDay?: string;

  @Field({ nullable: true })
  strength?: string;
}

@ArgsType()
export class UpdateMedicineInput extends CreateMedicineInput {
  @Field(() => ID!)
  id: number;
}
