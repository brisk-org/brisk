import { Field, InputType } from "type-graphql";

@InputType()
export class LaboratoryTestSubCategoryContentInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  inStock?: number;

  @Field()
  trackInStock: boolean;
}
