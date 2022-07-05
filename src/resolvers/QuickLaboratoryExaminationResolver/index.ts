import {
  CompleteQuickLabTestInput,
  CreateQuickLabTestInput,
} from "./InputType";
import {
  Arg,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  Subscription,
  PubSub,
  PubSubEngine,
  Float,
  Args,
} from "type-graphql";
import { QuickLaboratoryExamination } from "../../entities/QuickLaboratoryExamination";
import { OffsetFieldsWithTime } from "../../utils/SharedInputTypes/OffsetFields";
import { Notification } from "../../entities/Notification";
import {
  NEW_NOTIFICATION,
  NEW_CREATE_QUICK_LABORATORY_TEST,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { NotificationAction, Occupation } from "../../utils/EnumTypes";
import { QuickLaboratoryTest } from "../../entities/QuickLaboratoryTest";
@ObjectType()
@Resolver()
export class QuickLaboratoryExaminationResolver {
  @Query(() => Float)
  async quickLaboratoryExaminationCount(): Promise<number> {
    return await QuickLaboratoryExamination.count();
  }
  @Query(() => [QuickLaboratoryExamination])
  async quickLaboratoryExaminations(
    @Args() { skip, take }: OffsetFieldsWithTime
  ) {
    return await QuickLaboratoryExamination.find({
      order: { id: "DESC" },
      relations: ["tests"],
      skip,
      take,
    });
  }
  @Query(() => QuickLaboratoryExamination)
  async quickLaboratoryExamination(@Arg("id", () => ID) id: number | string) {
    return await QuickLaboratoryExamination.findOne(id, {
      relations: ["tests"],
    });
  }

  @Mutation(() => QuickLaboratoryExamination)
  async createQuickLaboratoryExamination(
    @Arg("input")
    { name, other, price, result, testIds }: CreateQuickLabTestInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<QuickLaboratoryExamination> {
    const quickLaboratoryTest = QuickLaboratoryExamination.create({
      name,
      other,
      result,
      price,
      tests: [],
    });
    for (let i = 0; i < testIds.length; i++) {
      const test = await QuickLaboratoryTest.findOne(testIds[i]);
      if (!test) {
        throw new Error(`errr herlksjdflkajs ${test}`);
      }
      quickLaboratoryTest.tests.push(test);
    }
    await quickLaboratoryTest.save();

    const notification = await Notification.create({
      quick_laboratory_test: quickLaboratoryTest,
      for: [Occupation["LABORATORY"]],
      action: NotificationAction["CREATE"],
      message: `A Quick Laboratory test For ${quickLaboratoryTest.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_QUICK_LABORATORY_TEST, {
      quickLaboratoryTest,
    });

    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryExamination)
  async completeQuickLaboratoryExamination(
    @Arg("input") input: CompleteQuickLabTestInput,
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryExamination.findOne(id, {
      relations: ["tests"],
    });
    await QuickLaboratoryExamination.update(id, {
      ...input,
      completed: true,
      new: false,
    });
    await quickLaboratoryTest?.reload();
    await pubsub.publish(NEW_CREATE_QUICK_LABORATORY_TEST, {
      quickLaboratoryTest,
    });

    const notification = await Notification.create({
      quick_laboratory_test: quickLaboratoryTest,
      for: [Occupation["RECEPTION"]],
      action: NotificationAction["COMPLETE"],
      message: `A Quick Laboratory test For ${quickLaboratoryTest?.name} was just completed!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test: quickLaboratoryTest,
        action: NotificationAction["CREATE"],
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_laboratory_test: quickLaboratoryTest,
      action: NotificationAction["CREATE"],
    });
    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryExamination)
  async markQuickLaboratoryExaminationAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryExamination.findOne(id, {
      relations: ["tests"],
    });
    if (!quickLaboratoryTest) {
      return null;
    }
    await QuickLaboratoryExamination.update(id, { paid: true });
    await quickLaboratoryTest?.reload();
    await pubsub.publish(NEW_CREATE_QUICK_LABORATORY_TEST, {
      quickLaboratoryTest,
    });
    const notification = await Notification.create({
      quick_laboratory_test: quickLaboratoryTest,
      for: [Occupation["DOCTOR"]],
      action: NotificationAction["PAYMENT"],
      message: `${quickLaboratoryTest?.name} just paid for a Quick Laboraoty Test!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });
    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test: quickLaboratoryTest,
        action: NotificationAction["COMPLETE"],
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_laboratory_test: quickLaboratoryTest,
      action: NotificationAction["COMPLETE"],
    });

    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryExamination)
  async markQuickLaboratoryExaminationAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quick_laboratory_test = await QuickLaboratoryExamination.findOne(id);
    if (!quick_laboratory_test) {
      return null;
    }
    await QuickLaboratoryExamination.update({ id }, { new: false });
    await quick_laboratory_test.reload();
    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test,
        action: NotificationAction["PAYMENT"],
      },
    });
    await quick_laboratory_test.reload();
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await Notification.delete({
      quick_laboratory_test,
      action: NotificationAction["PAYMENT"],
    });

    await quick_laboratory_test.reload();
    return quick_laboratory_test;
  }

  @Subscription(() => QuickLaboratoryExamination, {
    topics: NEW_CREATE_QUICK_LABORATORY_TEST,
  })
  async newCreatedQuickLaboratoryExamination(
    @Root()
    { quickLaboratoryTest }: { quickLaboratoryTest: QuickLaboratoryExamination }
  ): Promise<QuickLaboratoryExamination> {
    return quickLaboratoryTest;
  }
}
