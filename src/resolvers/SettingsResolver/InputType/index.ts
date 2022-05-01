import { InputType, Field } from "type-graphql";
import { PrescriptionInput as PrescriptionTestSettingInput } from "../../PrescriptionTestResolver/InputType";
@InputType()
export class LaboratoryTestSettingInput {
  @Field()
  name: string;
  @Field()
  category: string;
  @Field()
  price: number;
  @Field(() => String, { nullable: true })
  normalValue?: string;
}
@InputType()
export class ChangeSettingsInput {
  @Field()
  card_price: number;

  @Field()
  card_expiration_date: number;

  @Field(() => [LaboratoryTestSettingInput])
  laboratory_tests_data: string;

  @Field(() => [PrescriptionTestSettingInput])
  prescription_tests_data: string;
}
