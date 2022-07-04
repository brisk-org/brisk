import { ObjectType, Query, Resolver } from "type-graphql";
import { QuickMedicine } from "../../entities/QuickMedicine";

@ObjectType()
@Resolver()
export class QuickMedicineResolver {
  @Query(() => [QuickMedicine])
  async quickMedicines(): Promise<QuickMedicine[] | undefined> {
    return await QuickMedicine.find();
  }
}
