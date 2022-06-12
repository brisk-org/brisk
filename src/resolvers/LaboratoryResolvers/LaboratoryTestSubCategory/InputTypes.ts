import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class LaboratoryTestSubCategoryContentArgs {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  inStock?: number;

  @Field()
  trackInStock: boolean;
}
