import { GraphQLError } from "graphql";
import {
  ObjectType,
  Resolver,
  Arg,
  ID,
  Mutation,
  Query,
  Args,
} from "type-graphql";
import { LaboratoryTest } from "../../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../../entities/LaboratoryTestSubCategory";
import {
  LaboratoryTestContentInput,
  MoveLaboratoryTestArgs,
} from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestResolver {
  @Query(() => [LaboratoryTest])
  async laboratoryTests() {
    return LaboratoryTest.find({ relations: ["laboratoryTestExaminations"] });
  }
  @Query(() => [LaboratoryTest])
  async laboratoryTestsForCategory(
    @Arg("categoryId", () => ID!) categoryId: string
  ) {
    return LaboratoryTest.find({
      relations: ["category", "laboratoryTestExaminations"],
      where: { category: { id: categoryId } },
    });
  }
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
    if (subCategoryId) {
      const laboratoryTest = await LaboratoryTest.create({
        subCategory,
        ...content,
      }).save();
      subCategory?.laboratoryTests?.unshift(laboratoryTest);
      await subCategory?.save();
      return laboratoryTest;
    }
    return await LaboratoryTest.create({
      category,
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

    return laboratoryTest;
  }
  @Mutation(() => LaboratoryTest)
  async moveLaboratoryTest(
    @Args() { id, categoryId, subCategoryId }: MoveLaboratoryTestArgs
  ) {
    const laboratoryTest = await LaboratoryTest.findOne(id);
    const category = await LaboratoryTestCategory.findOne(categoryId);
    const subCategory = await LaboratoryTestSubCategory.findOne(subCategoryId);
    if (!laboratoryTest) {
      throw new GraphQLError("No category Found");
    }
    if (categoryId) {
      await LaboratoryTest.update(id, {
        category,
        subCategory: undefined,
      });
    }
    if (subCategoryId) {
      await LaboratoryTest.update(id, {
        subCategory,
        category: undefined,
      });
    }
    return laboratoryTest;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryTest(@Arg("id", () => ID!) id: number) {
    return (await LaboratoryTest.delete(id)).affected;
  }
}
