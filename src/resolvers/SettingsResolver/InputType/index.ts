import { InputType, Field } from "type-graphql";
// import { PrescriptionInput as PrescriptionTestSettingInput } from "../../PrescriptionRequestResolver/InputType";

@InputType()
export class ChangeSettingsInput {
  @Field()
  card_price: number;

  @Field()
  card_expiration_date: number;

  @Field(() => String!)
  laboratory_tests_data: string;

  @Field(() => String)
  prescription_tests_data: string;
}
