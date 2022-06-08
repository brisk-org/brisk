import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class LaboratoryTestCategoryContentArgs {
  @Field()
  name: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  inStock?: number;

  @Field()
  trackInStock: boolean;
}
