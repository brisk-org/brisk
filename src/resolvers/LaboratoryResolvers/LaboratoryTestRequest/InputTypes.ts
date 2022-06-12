import { Field, InputType } from "type-graphql";

@InputType()
export class LaboratoryTestContentInput {
  @Field()
  name: string;

  @Field()
  normalValue: string;

  @Field(() => [String], { nullable: true })
  commonValues?: string[];

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
