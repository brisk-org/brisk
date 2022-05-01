import { InputType, Field, ArgsType } from "type-graphql";

@InputType()
export class CreateProductInput {
  @Field()
  name: string;
  @Field()
  price: number;
  @Field()
  desc: string;
}

@ArgsType()
export class SearchField {
  @Field(() => String, { nullable: true })
  name?: string;
  @Field()
  skip: number;
  @Field()
  take: number;
}
