import {
  Arg,
  Args,
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
export class MedicineResolver {
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
  async addMedicine(@Args() { name, price, inStock }: CreateMedicineInput) {
    return await Medicine.create({
      name,
      price,
      inStock,
    }).save();
  }
  @Mutation(() => Medicine)
  async updateMedicine(@Args() { id, ...props }: UpdateMedicineInput) {
    const medicine = await Medicine.findOne(id);
    if (!medicine) {
      // throw new ApolloError(`No Medicine with id ${id}`);
      return;
    }
    await Medicine.update(id, {
      ...props,
    });
    await medicine.reload();
    return medicine;
  }

  @Mutation(() => Boolean)
  async deleteMedicine(@Arg("id", () => ID!) id: number) {
    await Medicine.delete(id);
    return true;
  }
}
