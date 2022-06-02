import { PerDay } from "../../../utils/EnumTypes";
import { Field, ID, ArgsType, InputType } from "type-graphql";
import { CheckInInput } from "../../../resolvers/MedicationResolver/InputType";
// import { CreateMedicationArgs } from "../../../resolvers/MedicationResolver/InputType";

@InputType()
class CreateMedicationsInput {
  @Field(() => ID!)
  medicineId: string;
  @Field({ nullable: true })
  strength?: string;
  @Field(() => PerDay)
  perDay: PerDay;
  @Field(() => [CheckInInput], {
    description: "getting this array from the client and stringify it ",
  })
  checkIn: CheckInInput[];
  @Field()
  forDays: number;
  @Field(() => String, { nullable: true })
  other?: string;
}

@ArgsType()
export class CreatePrescriptionArgs {
  @Field(() => ID!)
  cardId!: number;

  @Field(() => [CreateMedicationsInput])
  medications: CreateMedicationsInput[];

  @Field()
  price: number;

  @Field()
  rx: string;
}
