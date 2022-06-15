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
  @Mutation(() => Boolean)
  async deleteMedication(@Arg("id", () => ID!) id: number) {
    return (await Medication.delete(id)).affected;
  }
}
