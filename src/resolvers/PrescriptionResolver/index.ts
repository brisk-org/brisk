import {
  Arg,
  Args,
  Ctx,
  Float,
  ID,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Card } from "../../entities/Card";
import {
  CreatePrescriptionTestInput,
  UpdatePrescriptionTestInput,
} from "./InputType";
import { Prescription } from "../../entities/Prescription";
import Context from "../../constants/Context";
import {
  OffsetFieldsWithTime,
  SearchAndOffsetFields,
} from "../../utils/SharedInputTypes/OffsetFields";
import {
  NEW_CREATE_PRESCRIPTION,
  DELETE_NOTIFICATION,
  NEW_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { Notification } from "../../entities/Notification";

@ObjectType()
@Resolver()
export class PrescriptionResolver {
  @Query(() => Float)
  async prescriptionTestsCount(): Promise<number> {
    return await Prescription.count();
  }
  @Query(() => [Prescription])
  async prescriptionTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await Prescription.find({
      relations: ["card"],
      order: { updated_at: "DESC", inrolled: "DESC", id: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => Prescription)
  async prescriptionTest(@Arg("id", () => ID!) id: number | string) {
    return await Prescription.findOne(id, {
      relations: ["card"],
    });
  }
  @Query(() => [Prescription])
  async searchPrescriptionTests(
    @Args()
    { term, skip, take }: SearchAndOffsetFields,
    @Ctx() { connection }: Context
  ): Promise<Prescription[]> {
    return await connection
      .getRepository(Prescription)
      .createQueryBuilder("prescription")
      .leftJoinAndSelect("prescription.card", "card")
      .where("card.name ILIKE :name", { name: `%${term}%` })
      .skip(skip)
      .take(take)
      .orderBy("prescription.id", "DESC")
      .getMany();
  }
  @Mutation(() => Prescription)
  async createPrescriptionTest(
    @Arg("main") { price, cardId, result }: CreatePrescriptionTestInput,
    @Arg("rx") rx: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    const prescriptionTest = Prescription.create({
      result: JSON.stringify(result),
      card,
      price,
      rx,
    });

    card.prescription_tests?.unshift(prescriptionTest);
    await card.save();
    await prescriptionTest.save();

    const notification = await Notification.create({
      prescription_test_id: prescriptionTest.id,
      action: "CREATE_PRESCRIPTION_TEST",
      desc: `A prescription test For ${card.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescriptionTest,
    });

    return prescriptionTest;
  }

  @Mutation(() => Prescription)
  async markPrescriptionTestAsCompleted(
    @Arg("main") { id, result, done: completed }: UpdatePrescriptionTestInput,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }
    await Prescription.update(
      { id },
      {
        inrolled: !completed,
        completed,
        result: JSON.stringify(result),
      }
    );
    const notification = await Notification.create({
      prescription_test_id: prescriptionTest.id,
      action: "COMPLETE_PRESCRIPTION_TEST",
      desc: `A prescription test For ${prescriptionTest.card.name} was just completed!`,
    }).save();

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescriptionTest,
    });
    await pubsub.publish(NEW_NOTIFICATION, { notification });
    const deleteNotification = await Notification.findOne({
      where: {
        prescription_test_id: prescriptionTest.id,
        action: "PAY_FOR_PRESCRIPTION_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await Notification.delete({
      prescription_test_id: prescriptionTest.id,
      action: "PAY_FOR_PRESCRIPTION_TEST",
    });
    return prescriptionTest;
  }
  @Mutation(() => Prescription)
  async markPrescriptionTestAsPaid(
    @Arg("main") { id, result, done: paid }: UpdatePrescriptionTestInput,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }

    await Prescription.update(id, {
      paid,
      inrolled: true,
      result: JSON.stringify(result),
    });

    const notification = await Notification.create({
      prescription_test_id: prescriptionTest.id,
      action: "PAY_FOR_PRESCRIPTION_TEST",
      desc: ` ${prescriptionTest.card.name} just paid for the Prescription Test!`,
    }).save();
    const deleteNotification = await Notification.findOne({
      where: {
        prescription_test_id: prescriptionTest.id,
        action: "CREATE_PRESCRIPTION_TEST",
      },
    });

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescriptionTest,
    });
    await pubsub.publish(NEW_NOTIFICATION, { notification });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      prescription_test_id: prescriptionTest.id,
      action: "CREATE_PRESCRIPTION_TEST",
    });

    return prescriptionTest;
  }
  @Mutation(() => Boolean)
  async deletePrescriptionTest(@Arg("id", () => ID!) id: number) {
    await Prescription.delete(id);
    return true;
  }
  @Mutation(() => Prescription)
  async markPrescriptionTestAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }
    await Prescription.update({ id }, { new: false });
    const notification = await Notification.findOne({
      where: {
        prescription_test_id: prescriptionTest.id,
        action: "COMPLETE_PRESCRIPTION_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    await Notification.delete({
      prescription_test_id: prescriptionTest.id,
      action: "COMPLETE_PRESCRIPTION_TEST",
    });

    return prescriptionTest;
  }
  @Subscription(() => Prescription, {
    topics: NEW_CREATE_PRESCRIPTION,
  })
  async newCreatedPrescriptionTest(
    @Root() { prescriptionTest }: { prescriptionTest: Prescription }
  ): Promise<Prescription> {
    return prescriptionTest;
  }
}
