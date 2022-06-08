import { GraphQLError } from "graphql";
import { ObjectType, Resolver, Arg, ID, Mutation } from "type-graphql";
import { LaboratoryTest } from "../../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../../entities/LaboratoryTestSubCategory";
import { LaboratoryTestContentInput } from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestResolver {
  @Mutation(() => LaboratoryTest)
  async createLaboratoryTest(
    @Arg("categoryId", () => ID!) categoryId: string,
    @Arg("subCategoryId", () => ID, { nullable: true })
    subCategoryId: string | undefined,
    @Arg("content") content: LaboratoryTestContentInput
  ) {
    const category = await LaboratoryTestCategory.findOne(categoryId);
    const subCategory = await LaboratoryTestSubCategory.findOne(subCategoryId);
    if (!category) {
      throw new GraphQLError("Found");
    }
    return await LaboratoryTest.create({
      category,
      subCategory,
      ...content,
    }).save();
  }
  @Mutation(() => LaboratoryTest)
  async updateLaboratoryTest(
    @Arg("id", () => ID!) id: number,
    @Arg("content") content: LaboratoryTestContentInput
  ) {
    const laboratoryTest = await LaboratoryTest.findOne(id);
    if (!laboratoryTest) {
      throw new GraphQLError("No category Found");
    }
    await LaboratoryTest.update(id, { ...content });
    await laboratoryTest.reload();

    return laboratoryTest;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryTest(@Arg("id", () => ID!) id: number) {
    return (await LaboratoryTest.delete(id)).affected;
  }
}
