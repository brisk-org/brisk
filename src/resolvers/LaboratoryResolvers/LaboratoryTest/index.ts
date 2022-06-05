import { GraphQLError } from "graphql";
import { ObjectType, Resolver, Args, Arg, ID, Mutation } from "type-graphql";
import { LaboratoryTest } from "../../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../../entities/LaboratoryTestSubCategory";
import { LaboratoryTestContentArgs } from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestResolver {
  @Mutation(() => LaboratoryTest)
  async createLaboraotryTest(
    @Arg("categoryId", () => ID!) categoryId: string,
    @Arg("subCategoryId", () => ID!) subCategoryId: string,
    @Args()
    content: LaboratoryTestContentArgs
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
    @Args() content: LaboratoryTestContentArgs
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
