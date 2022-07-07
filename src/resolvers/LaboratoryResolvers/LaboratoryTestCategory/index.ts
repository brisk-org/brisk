import { GraphQLError } from "graphql";
import {
  ObjectType,
  Resolver,
  Query,
  Args,
  Arg,
  ID,
  Mutation,
} from "type-graphql";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestCategoryContentArgs } from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestCategoryResolver {
  @Query(() => [LaboratoryTestCategory])
  async laboratoryTestCategories() {
    return await LaboratoryTestCategory.find({
      relations: [
        "laboratoryTests",
        "laboratoryTests.laboratoryTestExaminations",
        "subCategories",
        "subCategories.laboratoryTests",
      ],
      order: { id: "ASC" },
    });
  }

  @Mutation(() => LaboratoryTestCategory)
  async createLaboratoryTestCategory(
    @Args()
    content: LaboratoryTestCategoryContentArgs
  ) {
    return await LaboratoryTestCategory.create({
      ...content,
      subCategories: [],
      laboratoryTests: [],
    }).save();
  }
  @Mutation(() => LaboratoryTestCategory)
  async updateLaboratoryTestCategory(
    @Arg("id", () => ID!) id: number,
    @Args() content: LaboratoryTestCategoryContentArgs
  ) {
    const category = await LaboratoryTestCategory.findOne(id);
    if (!category) {
      throw new GraphQLError("No category Found");
    }
    await LaboratoryTestCategory.update(id, { ...content });

    return category;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryTestCategory(@Arg("id", () => ID!) id: number) {
    return (await LaboratoryTestCategory.delete(id)).affected;
  }
}
