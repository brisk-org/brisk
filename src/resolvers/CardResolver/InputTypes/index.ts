import { InputType, Field, ArgsType } from "type-graphql";

@InputType()
export class CardProfileInput {
  @Field()
  name: string;
  @Field()
  phone: string;
  @Field()
  gender: string;
  @Field()
  age: string;
  @Field({ nullable: true })
  kebele?: string;
  @Field({ nullable: true })
  k_ketema?: string;
  @Field({ nullable: true })
  house_no?: string;
  @Field({ nullable: true })
  address?: string;
}

@ArgsType()
export class SearchField {
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  phone?: string;
  @Field()
  skip: number;
  @Field()
  take: number;
}
