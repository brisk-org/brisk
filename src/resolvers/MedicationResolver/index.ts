import {
  Arg,
  Float,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Medication } from "../../entities/Medication";

@ObjectType()
@Resolver()
export class MedicationResolver {
  @Query(() => Float)
  async medicationCount(): Promise<number> {
    return await Medication.count();
  }
  @Query(() => [Medication])
  async medications(): Promise<Medication[]> {
    return await Medication.find({
      relations: ["medicine", "prescription"],
    });
  }
  @Query(() => Medication)
  async medication(
    @Arg("id", () => ID!) id: number | string
  ): Promise<Medication | undefined> {
    return await Medication.findOne(id, {
      relations: ["medicine", "prescription"],
    });
  }
  @Mutation(() => Medication)
  async createMedication() {
    // const medicine = await Medicine.findOne();
    // const prescription = await Prescription.findOne(
    //   medicationArgs.prescriptionId
    // );
    // if (!prescription) {
    //   throw new ApolloError("Prescription doesn't exist");
    // }
    // if (!medicine) {
    //   throw new ApolloError("No medicine found");
    // }
    // console.log("here", medicationArgs, "here");
    // const medication = Medication.create({
    //   medicine,
    //   prescription,
    //   ...medicationArgs,
    // });
    // prescription.medications?.unshift(medication);
    // await prescription.save();
    // await medication.save();
    // return medication;
  }

  @Mutation(() => Boolean)
  async deleteMedication(@Arg("id", () => ID!) id: number) {
    return (await Medication.delete(id)).affected;
  }
}
