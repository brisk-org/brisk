import {
  Args,
  Float,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { CreatePrescriptionMedicationArgs as CreateMedicationArgs } from "./InputType";
import { Prescription } from "../../entities/Medication";

import { Medicine } from "../../entities/Medicine";

@ObjectType()
@Resolver()
export class MedicationResolver {
  @Query(() => Float)
  async prescriptionMedicationCout(): Promise<number> {
    return await Prescription.count();
  }

  @Mutation(() => Prescription)
  async createMedication(@Args() medication: CreateMedicationArgs) {
    const medicine = await Medicine.findOne(medication.medicineId);
    return await Prescription.create({
      medicine,
      ...medication,
    }).save();
  }
}
