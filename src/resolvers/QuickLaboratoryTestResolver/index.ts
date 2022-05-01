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
import { QuickLaboratoryTest } from "../../entities/QuickLaboratoryTest";
import { OffsetFieldsWithTime } from "../../utils/SharedInputTypes/OffsetFields";
import { Notification } from "../../entities/Notification";
import {
  NEW_NOTIFICATION,
  NEW_CREATE_QUICK_LABORATORY_TEST,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
@ObjectType()
@Resolver()
export class QuickLaboratoryTestResolver {
  @Query(() => Float)
  async quickLaboratoryTestsCount(): Promise<number> {
    return await QuickLaboratoryTest.count();
  }
  @Query(() => [QuickLaboratoryTest])
  async quickLaboratoryTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await QuickLaboratoryTest.find({
      order: { id: "DESC" },
      skip,
      take,
    });
  }

  @Mutation(() => QuickLaboratoryTest)
  async createQuickLaboratoryTest(
    @Arg("input") input: CreateQuickLabTestInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<QuickLaboratoryTest> {
    const quickLaboratoryTest = await QuickLaboratoryTest.create({
      ...input,
    }).save();

    const notification = await Notification.create({
      quick_laboratory_test_id: quickLaboratoryTest?.id,
      action: "CREATE_QUICK_LABORATORY_TEST",
      desc: `A Quick Laboratory test For ${quickLaboratoryTest.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_QUICK_LABORATORY_TEST, {
      quickLaboratoryTest,
    });

    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryTest)
  async completeQuickLaboratoryTest(
    @Arg("input") input: CompleteQuickLabTestInput,
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryTest.findOne(id);
    await QuickLaboratoryTest.update(id, {
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
      quick_laboratory_test_id: quickLaboratoryTest?.id,
      action: "COMPLETE_QUICK_LABORATORY_TEST",
      desc: `A Quick Laboratory test For ${quickLaboratoryTest?.name} was just completed!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test_id: quickLaboratoryTest?.id,
        action: "CREATE_QUICK_LABORATORY_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_laboratory_test_id: quickLaboratoryTest?.id,
      action: "CREATE_QUICK_LABORATORY_TEST",
    });
    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryTest)
  async markQuickLaboratoryTestAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickLaboratoryTest = await QuickLaboratoryTest.findOne(id);
    if (!quickLaboratoryTest) {
      return null;
    }
    await QuickLaboratoryTest.update(id, { paid: true });
    await quickLaboratoryTest?.reload();
    await pubsub.publish(NEW_CREATE_QUICK_LABORATORY_TEST, {
      quickLaboratoryTest,
    });
    const notification = await Notification.create({
      quick_laboratory_test_id: quickLaboratoryTest.id,
      action: "PAY_FOR_QUICK_LABORATORY_TEST",
      desc: `${quickLaboratoryTest?.name} just paid for a Quick Laboraoty Test!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });
    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test_id: quickLaboratoryTest?.id,
        action: "COMPLETE_QUICK_LABORATORY_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      quick_laboratory_test_id: quickLaboratoryTest?.id,
      action: "COMPLETE_QUICK_LABORATORY_TEST",
    });

    return quickLaboratoryTest;
  }
  @Mutation(() => QuickLaboratoryTest)
  async markQuickLaboratoryTestAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quick_laboratory_test = await QuickLaboratoryTest.findOne(id);
    if (!quick_laboratory_test) {
      return null;
    }
    await QuickLaboratoryTest.update({ id }, { new: false });
    await quick_laboratory_test.reload();
    const deleteNotification = await Notification.findOne({
      where: {
        quick_laboratory_test_id: quick_laboratory_test.id,
        action: "PAY_FOR_QUICK_LABORATORY_TEST",
      },
    });
    await quick_laboratory_test.reload();
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await Notification.delete({
      quick_laboratory_test_id: quick_laboratory_test.id,
      action: "PAY_FOR_QUICK_LABORATORY_TEST",
    });

    await quick_laboratory_test.reload();
    return quick_laboratory_test;
  }

  @Subscription(() => QuickLaboratoryTest, {
    topics: NEW_CREATE_QUICK_LABORATORY_TEST,
  })
  async newCreatedQuickLaboratoryTest(
    @Root()
    { quickLaboratoryTest }: { quickLaboratoryTest: QuickLaboratoryTest }
  ): Promise<QuickLaboratoryTest> {
    return quickLaboratoryTest;
  }
}
