import { GraphQLError } from "graphql";
import { ObjectType, Resolver, Query, Arg, ID, Mutation } from "type-graphql";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../../entities/LaboratoryTestSubCategory";
import { LaboratoryTestSubCategoryContentInput } from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestSubCategoryResolver {
  @Query(() => [LaboratoryTestSubCategory])
  async laboratoryTestSubCategories() {
    return await LaboratoryTestSubCategory.find({
      relations: ["laboratoryTests", "category"],
    });
  }

  @Mutation(() => LaboratoryTestSubCategory)
  async createLaboraotryTestSubCategory(
    @Arg("id", () => ID!) id: string,
    @Arg("content") content: LaboratoryTestSubCategoryContentInput
  ) {
    const category = await LaboratoryTestCategory.findOne(id);
    if (!category) {
      throw new GraphQLError("Found");
    }
    return await LaboratoryTestSubCategory.create({
      ...content,
      category,
      laboratoryTests: [],
    }).save();
  }
  @Mutation(() => LaboratoryTestSubCategory)
  async updateLaboratoryTestSubCategory(
    @Arg("id", () => ID!) id: number,
    @Arg("content") content: LaboratoryTestSubCategoryContentInput
  ) {
    const subCategory = await LaboratoryTestSubCategory.findOne(id);
    if (!subCategory) {
      throw new GraphQLError("No category Found");
    }
    await LaboratoryTestSubCategory.update(id, { ...content });
    await subCategory.reload();

    return subCategory;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryTestSubCategory(@Arg("id", () => ID!) id: number) {
    return (await LaboratoryTestSubCategory.delete(id)).affected;
  }
}
