import { InputType, Field } from "type-graphql";

@InputType()
export class ChangeSettingsInput {
  @Field()
  card_price: number;

  @Field()
  card_expiration_date: number;
}
