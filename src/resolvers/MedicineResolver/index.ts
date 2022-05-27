import {
  Arg,
  Float,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { CreateMedicineInput, UpdateMedicineInput } from "./InputType";
import { Medicine } from "../../entities/Medicine";

@ObjectType()
@Resolver()
export class PrescriptionRequestResolver {
  @Query(() => Float)
  async medicineCount(): Promise<number> {
    return await Medicine.count();
  }
  @Query(() => [Medicine])
  async medicines() {
    return await Medicine.find();
  }
  @Query(() => Medicine)
  async medicine(@Arg("id", () => ID!) id: number | string) {
    return await Medicine.findOne(id);
  }
  @Mutation(() => Medicine)
  async addMedicine(
    @Arg("main") { name, price, inStock }: CreateMedicineInput
  ) {
    return await Medicine.create({
      name,
      price,
      inStock,
    }).save();
  }
  @Mutation(() => Medicine)
  async updateMedicine(
    @Arg("main") { id, name, price, inStock }: UpdateMedicineInput
  ) {
    return await Medicine.update(id, {
      name,
      price,
      inStock,
    });
  }

  @Mutation(() => Boolean)
  async deleteMedicine(@Arg("id", () => ID!) id: number) {
    await Medicine.delete(id);
    return true;
  }
}
