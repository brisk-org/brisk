import {
  CompleteQuickPrescriptionTestInput,
  CreateQuickPrescriptionTestInput,
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
import { QuickPrescriptionTest } from "../../entities/QuickPrescriptionTest";
import { OffsetFieldsWithTime } from "../../utils/SharedInputTypes/OffsetFields";
import { Notification } from "../../entities/Notification";
import {
  NEW_NOTIFICATION,
  NEW_CREATE_QUICK_PRESCRIPTION,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { NotificationAction, Occupation } from "../..//utils/EnumTypes";

@ObjectType()
@Resolver()
export class QuickPrescriptionResolver {
  @Query(() => Float)
  async quickPrescriptionTestsCount(): Promise<number> {
    return await QuickPrescriptionTest.count();
  }
  @Query(() => [QuickPrescriptionTest])
  async quickPrescriptionTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await QuickPrescriptionTest.find({
      order: { id: "DESC" },
      skip,
      take,
    });
  }
  @Mutation(() => QuickPrescriptionTest)
  async createQuickPrescriptionTest(
    @Arg("input") input: CreateQuickPrescriptionTestInput,
    @PubSub() pubsub: PubSubEngine
  ) {
    const result = JSON.stringify(input.result);
    const quickPrescriptionTest = QuickPrescriptionTest.create({
      ...input,
      result,
    });

    await quickPrescriptionTest.save();

    const notification = await Notification.create({
      quick_prescription_test: quickPrescriptionTest,
      action: NotificationAction["CREATE"],
      for: [Occupation["NURSE"]],
      message: `A Quick Prescription test For ${quickPrescriptionTest.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_QUICK_PRESCRIPTION, {
      quickPrescriptionTest,
    });

    return quickPrescriptionTest;
  }
  @Mutation(() => QuickPrescriptionTest)
  async completeQuickPrescriptionTest(
    @Arg("input") input: CompleteQuickPrescriptionTestInput,
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescriptionTest.findOne(id);
    await QuickPrescriptionTest.update(id, {
      ...input,
      completed: true,
    });
    await quickPrescriptionTest?.reload();

    const notification = await Notification.create({
      quick_prescription_test: quickPrescriptionTest,
      action: NotificationAction["COMPLETE"],
      for: [Occupation["NURSE"], Occupation["DOCTOR"]],
      message: `A Quick Prescription test For ${quickPrescriptionTest?.name} was just completed!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_QUICK_PRESCRIPTION, {
      quickPrescriptionTest,
    });
    const deleteNotification = await Notification.findOne({
      where: {
        quick_prescription_test: quickPrescriptionTest,
        action: NotificationAction["CREATE"],
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_prescription_test: quickPrescriptionTest,
      action: NotificationAction["CREATE"],
    });

    return quickPrescriptionTest;
  }
  @Mutation(() => QuickPrescriptionTest)
  async markQuickPrescriptionTestAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescriptionTest.findOne(id);
    if (!quickPrescriptionTest) {
      return null;
    }

    await QuickPrescriptionTest.update(id, { paid: true });
    await quickPrescriptionTest?.reload();

    await pubsub.publish(NEW_CREATE_QUICK_PRESCRIPTION, {
      quickPrescriptionTest,
    });
    const notification = await Notification.create({
      quick_prescription_test: quickPrescriptionTest,
      for: [Occupation["NURSE"]],
      action: NotificationAction["PAYMENT"],
      message: `${quickPrescriptionTest.name} just paid for a Quick Laboraoty Test!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    const deleteNotification = await Notification.findOne({
      where: {
        quick_prescription_test: quickPrescriptionTest,
        action: NotificationAction["COMPLETE"],
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_prescription_test: quickPrescriptionTest,
      action: NotificationAction["COMPLETE"],
    });

    return quickPrescriptionTest;
  }
  @Mutation(() => QuickPrescriptionTest)
  async markQuickPrescriptionTestAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescriptionTest.findOne(id);
    if (!quickPrescriptionTest) {
      return null;
    }
    await QuickPrescriptionTest.update({ id }, { new: false });
    await quickPrescriptionTest.reload();

    const deleteNotification = await Notification.findOne({
      where: {
        quick_prescription_test: quickPrescriptionTest,
        action: NotificationAction["PAYMENT"],
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await Notification.delete({
      quick_prescription_test: quickPrescriptionTest,
      action: NotificationAction["PAYMENT"],
    });
    await quickPrescriptionTest.reload();
    return quickPrescriptionTest;
  }

  @Subscription(() => QuickPrescriptionTest, {
    topics: NEW_CREATE_QUICK_PRESCRIPTION,
  })
  async newCreatedQuickPrescriptionTest(
    @Root()
    { quickPrescriptionTest }: { quickPrescriptionTest: QuickPrescriptionTest }
  ): Promise<QuickPrescriptionTest> {
    return quickPrescriptionTest;
  }
}
