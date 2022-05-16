import { LaboratoryTestResult } from "../../LaboratoryTestResolver/InputType";
import { InputType, Field } from "type-graphql";
import { PrescriptionInput as PrescriptionTestSettingInput } from "../../PrescriptionTestResolver/InputType";

@InputType()
export class ChangeSettingsInput {
  @Field()
  card_price: number;

  @Field()
  card_expiration_date: number;

  @Field(() => [LaboratoryTestResult])
  laboratory_tests_data: string;

  @Field(() => [PrescriptionTestSettingInput])
  prescription_tests_data: string;
}
