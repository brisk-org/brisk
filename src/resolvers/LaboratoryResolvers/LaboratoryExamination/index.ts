import {
  ObjectType,
  Resolver,
  Query,
  Float,
  Args,
  Arg,
  ID,
  Ctx,
  Mutation,
  Subscription,
  Root,
} from "type-graphql";
import Context from "../../../constants/Context";
import {
  NEW_NOTIFICATION,
  NEW_CREATE_LABORATORY_TEST,
  DELETE_NOTIFICATION,
} from "../../../constants/subscriptionTriggername";
import { Card } from "../../../entities/Card";
import { LaboratoryExamination } from "../../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../../entities/LaboratoryTestSubCategory";
import { Notification } from "../../../entities/Notification";
import { Occupation, NotificationAction } from "../../../utils/EnumTypes";
import {
  OffsetFieldsWithTime,
  SearchAndOffsetFields,
} from "../../../utils/SharedInputTypes/OffsetFields";
import {
  CompleteLaboratoryExaminationInput,
  CreateLaboratoryExaminationArgs,
} from "./InputTypes";

@ObjectType()
@Resolver()
export class LaboratoryExaminationResolver {
  @Query(() => Float)
  async laboratoryExaminationCount(): Promise<number> {
    return await LaboratoryExamination.count();
  }
  @Query(() => [LaboratoryExamination])
  async laboratoryExaminations(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await LaboratoryExamination.find({
      relations: ["card", "laboratoryTests"],
      order: { updated_at: "DESC", id: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => LaboratoryExamination)
  async laboratoryExamination(@Arg("id", () => ID!) id: number | string) {
    return await LaboratoryExamination.findOne(id, {
      relations: [
        "card",
        "laboratoryTests",
        "laboratoryTests.category",
        "laboratoryTests.subCategory",
      ],
    });
  }

  @Query(() => [LaboratoryExamination])
  async searchLaboratoryExamination(
    @Args() { term, skip, take }: SearchAndOffsetFields,
    @Ctx() { connection }: Context,
  ): Promise<LaboratoryExamination[]> {
    return await connection
      .getRepository(LaboratoryExamination)
      .createQueryBuilder("lab_test")
      .leftJoinAndSelect("lab_test.card", "card")
      .where("card.name ILIKE :name", { name: `%${term}%` })
      .skip(skip)
      .take(take)
      .orderBy("lab_test.id", "DESC")
      .getMany();
  }

  @Mutation(() => LaboratoryExamination)
  async createLaboratoryExamination(
    @Args()
    {
      price,
      cardId,
      laboratoryTest: laboratoryTestArgs,
      selectedCategories,
      selectedSubCategories,
    }: CreateLaboratoryExaminationArgs,
    @Ctx() { pubsub }: Context,
  ) {
    const card = await Card.findOne(cardId);
    const laboratoryTest = await LaboratoryTest.findByIds(laboratoryTestArgs);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    for (let i = 0; i < laboratoryTestArgs.length; i++) {
      const labTest = await LaboratoryTest.findOne(laboratoryTestArgs[i].id);
      if (labTest && labTest?.trackInStock && labTest.inStock) {
        labTest.inStock = labTest.inStock - 1;
        await labTest.save();
      }
    }
    if (selectedCategories) {
      for (let i = 0; i < selectedCategories.length; i++) {
        const category = await LaboratoryTestCategory.findOne(
          selectedCategories[i],
        );
        if (category && category.trackInStock && category.inStock) {
          category.inStock = category.inStock - 1;
          await category.save();
        }
      }
    }
    console.log(selectedSubCategories, "herrree[lskdjf");
    if (selectedSubCategories) {
      for (let i = 0; i < selectedSubCategories.length; i++) {
        const subCategory = await LaboratoryTestSubCategory.findOne(
          selectedSubCategories[i],
        );
        console.log(subCategory);
        if (subCategory && subCategory.trackInStock && subCategory.inStock) {
          subCategory.inStock = subCategory.inStock - 1;
          await subCategory.save();
        }
      }
    }

    const laboratoryExamination = LaboratoryExamination.create({
      laboratoryTests: laboratoryTest,
      card,
      price,
    });

    card.laboratoryExaminations?.unshift(laboratoryExamination);
    await card.save();
    await laboratoryExamination.save();

    const notification = await Notification.create({
      laboratory_test: laboratoryExamination,
      for: [Occupation["RECEPTION"]],
      action: NotificationAction["CREATE"],
      message: `A laboratory test For ${card.name} was just requested!`,
    }).save();

    pubsub.publish(NEW_NOTIFICATION, { notification });

    pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratoryExamination,
    });

    return laboratoryExamination;
  }
  @Mutation(() => LaboratoryExamination)
  async completeLaboratoryExamination(
    @Arg("id", () => ID!) id: number,
    @Arg("content", () => [CompleteLaboratoryExaminationInput])
    laboratoryTestContent: CompleteLaboratoryExaminationInput[],
    @Ctx() { pubsub }: Context,
  ) {
    const laboraotryExamination = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboraotryExamination) {
      return null;
    }

    await LaboratoryExamination.update(
      { id },
      {
        values: laboratoryTestContent,
        completed: true,
        // result,
      },
    );
    const notification = await Notification.create({
      laboratory_test: laboraotryExamination,
      for: [Occupation["DOCTOR"]],
      action: NotificationAction["COMPLETE"],
      message: `A laboratory test For ${laboraotryExamination.card.name} was just completed!`,
    }).save();
    const deleteNotification = await Notification.findOne({
      where: {
        laboratory_test: laboraotryExamination,
        action: "PAY_FOR_LABORATORY_TEST",
      },
    });

    pubsub.publish(NEW_NOTIFICATION, { notification });
    pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification!,
    });
    pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboraotryExamination,
    });

    await Notification.delete({
      laboratory_test: laboraotryExamination,
      action: NotificationAction["PAYMENT"],
    });

    return laboraotryExamination;
  }

  @Mutation(() => LaboratoryExamination)
  async saveLaboratoryExamination(
    @Arg("id", () => ID!) id: number,
    @Arg("content", () => [CompleteLaboratoryExaminationInput])
    laboratoryTestContent: CompleteLaboratoryExaminationInput[],
  ) {
    const laboratoryExamination = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboratoryExamination) {
      return null;
    }

    await LaboratoryExamination.update(
      { id },
      {
        values: laboratoryTestContent,
      },
    );
    await laboratoryExamination.reload();
    console.log(laboratoryExamination);

    return laboratoryExamination;
  }
  @Mutation(() => LaboratoryExamination)
  async payForLaboratoryExamination(
    @Arg("id", () => ID!) id: number,
    @Ctx() { pubsub }: Context,
  ) {
    const laboratory_test = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboratory_test) {
      return null;
    }
    await LaboratoryExamination.update(id, { paid: true });

    const notification = await Notification.create({
      laboratory_test,
      action: NotificationAction["PAYMENT"],
      for: [Occupation["LABORATORY"]],
      message: ` ${laboratory_test.card.name} just paid for the Laboratory Test!`,
    }).save();

    const deleteNotification = await Notification.findOne({
      where: {
        laboratory_test,
        action: NotificationAction["CREATE"],
      },
    });

    pubsub.publish(NEW_NOTIFICATION, { notification });
    pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification!,
    });

    pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratory_test,
    });
    await Notification.delete({
      laboratory_test,
      action: NotificationAction["CREATE"],
    });
    return laboratory_test;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryExamination(@Arg("id", () => ID!) id: number) {
    await LaboratoryExamination.delete(id);
    return true;
  }
  @Mutation(() => LaboratoryExamination)
  async markLaboratoryExaminationAsSeen(
    @Arg("id", () => ID!) id: number,
    @Ctx() { pubsub }: Context,
  ) {
    const laboratory_test = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboratory_test) {
      return null;
    }
    const notification = await Notification.findOne({
      where: {
        laboratory_test,
        action: NotificationAction["COMPLETE"],
      },
    });
    pubsub.publish(DELETE_NOTIFICATION, {
      notification: notification!,
    });
    await LaboratoryExamination.update({ id }, { new: false });
    await Notification.delete({
      laboratory_test,
      action: NotificationAction["COMPLETE"],
    });

    return laboratory_test;
  }
  @Subscription(() => LaboratoryExamination, {
    topics: NEW_CREATE_LABORATORY_TEST,
  })
  async newCreatedLaboratoryExamination(
    @Root() { laboratoryTest }: { laboratoryTest: LaboratoryExamination },
  ): Promise<LaboratoryExamination> {
    return laboratoryTest;
  }
}
