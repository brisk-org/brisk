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
import { CreatePrescriptionTestInput } from "./InputType";
import { PrescriptionTest } from "../../entities/PrescriptionTest";
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
    return await PrescriptionTest.count();
  }
  @Query(() => [PrescriptionTest])
  async prescriptionTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await PrescriptionTest.find({
      relations: ["card"],
      order: { id: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => PrescriptionTest)
  async prescriptionTest(@Arg("id", () => ID!) id: number | string) {
    return await PrescriptionTest.findOne(id, {
      relations: ["card"],
    });
  }
  @Query(() => [PrescriptionTest])
  async searchPrescriptionTests(
    @Args()
    { term, skip, take }: SearchAndOffsetFields,
    @Ctx() { connection }: Context
  ): Promise<PrescriptionTest[]> {
    return await connection
      .getRepository(PrescriptionTest)
      .createQueryBuilder("prescription")
      .leftJoinAndSelect("prescription.card", "card")
      .where("card.name ILIKE :name", { name: `%${term}%` })
      .skip(skip)
      .take(take)
      .orderBy("prescription.id", "DESC")
      .getMany();
  }
  @Mutation(() => PrescriptionTest)
  async createPrescriptionTest(
    @Arg("main") { price, cardId, result }: CreatePrescriptionTestInput,
    @Arg("rx") rx: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    const prescriptionTest = PrescriptionTest.create({
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

  @Mutation(() => PrescriptionTest)
  async markPrescriptionTestAsCompleted(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await PrescriptionTest.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }
    await PrescriptionTest.update(
      { id },
      {
        completed: true,
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
  @Mutation(() => PrescriptionTest)
  async markPrescriptionTestAsPaid(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await PrescriptionTest.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }

    await PrescriptionTest.update(id, { paid: true });

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
    await PrescriptionTest.delete(id);
    return true;
  }
  @Mutation(() => PrescriptionTest)
  async markPrescriptionTestAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescriptionTest = await PrescriptionTest.findOne(id, {
      relations: ["card"],
    });
    if (!prescriptionTest) {
      return null;
    }
    await PrescriptionTest.update({ id }, { new: false });
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
  @Subscription(() => PrescriptionTest, {
    topics: NEW_CREATE_PRESCRIPTION,
  })
  async newCreatedPrescriptionTest(
    @Root() { prescriptionTest }: { prescriptionTest: PrescriptionTest }
  ): Promise<PrescriptionTest> {
    return prescriptionTest;
  }
}
