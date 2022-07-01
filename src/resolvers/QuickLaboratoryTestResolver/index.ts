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
export class QuickLaboratoryTestResolver {
  @Query(() => Float)
  async quickLaboratoryTestsCount(): Promise<number> {
    return await QuickLaboratoryExamination.count();
  }
  @Query(() => [QuickLaboratoryExamination])
  async quickLaboratoryTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await QuickLaboratoryExamination.find({
      order: { id: "DESC" },
      skip,
      take,
    });
  }

  @Mutation(() => QuickLaboratoryExamination)
  async createQuickLaboratoryTest(
    @Arg("input") { name, other, price, testIds }: CreateQuickLabTestInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<QuickLaboratoryExamination> {
    const tests = await QuickLaboratoryTest.find({ where: { id: testIds } });
    const quickLaboratoryTest = await QuickLaboratoryExamination.create({
      name,
      other,
      price,
      tests,
    }).save();

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
  async completeQuickLaboratoryTest(
    @Arg("input") input: CompleteQuickLabTestInput,
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryExamination.findOne(id);
    await QuickLaboratoryExamination.update(id, {
      ...input,
      completed: true,
      new: false,
    });
    await quickLaboratoryTest?.reload();
    quickLaboratoryTest?.reload();
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
  async markQuickLaboratoryTestAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryExamination.findOne(id);
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
  async markQuickLaboratoryTestAsSeen(
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
  async newCreatedQuickLaboratoryTest(
    @Root()
    { quickLaboratoryTest }: { quickLaboratoryTest: QuickLaboratoryExamination }
  ): Promise<QuickLaboratoryExamination> {
    return quickLaboratoryTest;
  }
}
