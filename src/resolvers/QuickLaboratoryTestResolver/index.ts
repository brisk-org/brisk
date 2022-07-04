import { ObjectType, Query, Resolver } from "type-graphql";
import { QuickLaboratoryTest } from "../../entities/QuickLaboratoryTest";

@ObjectType()
@Resolver()
export class QuickLaboratoryTestResolver {
  @Query(() => [QuickLaboratoryTest])
  async quickLaboratoryTests(): Promise<QuickLaboratoryTest[] | undefined> {
    return await QuickLaboratoryTest.find({ relations: ["examinations"] });
  }
}
