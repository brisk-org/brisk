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
import { QuickPrescription } from "../../entities/QuickPrescription";
import { OffsetFieldsWithTime } from "../../utils/SharedInputTypes/OffsetFields";
import { Notification } from "../../entities/Notification";
import {
  NEW_NOTIFICATION,
  NEW_CREATE_QUICK_PRESCRIPTION,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { NotificationAction, Occupation } from "../../utils/EnumTypes";
import { QuickMedicine } from "../../entities/QuickMedicine";

@ObjectType()
@Resolver()
export class QuickPrescriptionResolver {
  @Query(() => Float)
  async quickPrescriptionCount(): Promise<number> {
    return await QuickPrescription.count();
  }
  @Query(() => QuickPrescription)
  async quickPrescription(@Arg("id", () => ID) id: number | string) {
    return await QuickPrescription.findOne(id, { relations: ["medicines"] });
  }
  @Query(() => [QuickPrescription])
  async quickPrescriptions(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await QuickPrescription.find({
      order: { id: "DESC" },
      relations: ["medicines"],
      skip,
      take,
    });
  }
  @Mutation(() => QuickPrescription)
  async createQuickPrescription(
    @Arg("input")
    { name, price, medicineIds, other }: CreateQuickPrescriptionTestInput,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = QuickPrescription.create({
      name,
      price,
      other,
      medicines: [],
    });

    for (let i = 0; i < medicineIds.length; i++) {
      const medicine = await QuickMedicine.findOne(medicineIds[i]);
      if (!medicine) {
        throw new Error(`No medicine named ${medicine} found`);
      }
      quickPrescriptionTest.medicines.push(medicine);
    }

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
  @Mutation(() => QuickPrescription)
  async completeQuickPrescription(
    @Arg("input") input: CompleteQuickPrescriptionTestInput,
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescription.findOne(id, {
      relations: ["medicines"],
    });
    await QuickPrescription.update(id, {
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
  @Mutation(() => QuickPrescription)
  async markQuickPrescriptionAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescription.findOne(id, {
      relations: ["medicines"],
    });
    if (!quickPrescriptionTest) {
      return null;
    }

    await QuickPrescription.update(id, { paid: true });
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
  @Mutation(() => QuickPrescription)
  async markQuickPrescriptionAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const quickPrescriptionTest = await QuickPrescription.findOne(id);
    if (!quickPrescriptionTest) {
      return null;
    }
    await QuickPrescription.update({ id }, { new: false });
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

  @Subscription(() => QuickPrescription, {
    topics: NEW_CREATE_QUICK_PRESCRIPTION,
  })
  async newCreatedQuickPrescription(
    @Root()
    { quickPrescriptionTest }: { quickPrescriptionTest: QuickPrescription }
  ): Promise<QuickPrescription> {
    return quickPrescriptionTest;
  }
}
