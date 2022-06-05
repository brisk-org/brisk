import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class LaboratoryTestSubCategoryContentArgs {
  @Field()
  name: string;

  @Field()
  price: number;
}
