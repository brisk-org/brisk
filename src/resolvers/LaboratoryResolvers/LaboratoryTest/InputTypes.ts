import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class LaboratoryTestContentArgs {
  @Field()
  name: string;

  @Field()
  normalValue: string;

  @Field(() => [String])
  commonValues: string[];

  @Field({ nullable: true })
  price?: number;

  @Field()
  hasPrice: boolean;

  @Field()
  isInfluencedByCategory: boolean;

  @Field({ nullable: true })
  inStock?: number;

  @Field()
  trackInStock: boolean;
}
