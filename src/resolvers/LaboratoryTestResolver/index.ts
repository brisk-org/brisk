import { LaboratoryTest } from "../../entities/LaboratoryTest";
import {
  Arg,
  Ctx,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  PubSub,
  PubSubEngine,
  Root,
  Subscription,
  Float,
  Args,
} from "type-graphql";
import { Card } from "../../entities/Card";
import { CreateLaboratoryTestInput } from "./InputType";

import {
  OffsetFieldsWithTime,
  SearchAndOffsetFields,
} from "../../utils/SharedInputTypes/OffsetFields";
import Context from "../../constants/Context";
import { Notification } from "../../entities/Notification";
import {
  NEW_NOTIFICATION,
  DELETE_NOTIFICATION,
  NEW_CREATE_LABORATORY_TEST,
} from "../../constants/subscriptionTriggername";
import { NotificationAction, Occupation } from "../../utils/EnumTypes";

@ObjectType()
@Resolver()
export class LaboratoryTestResolver {
  @Query(() => Float)
  async laboratoryTestsCount(): Promise<number> {
    return await LaboratoryTest.count();
  }
  @Query(() => [LaboratoryTest])
  async laboratoryTests(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await LaboratoryTest.find({
      relations: ["card"],
      order: { updated_at: "DESC", id: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => LaboratoryTest)
  async laboratoryTest(@Arg("id", () => ID!) id: number | string) {
    return await LaboratoryTest.findOne(id, {
      relations: ["card"],
    });
  }

  @Query(() => [LaboratoryTest])
  async searchLaboratoryTests(
    @Args() { term, skip, take }: SearchAndOffsetFields,
    @Ctx() { connection }: Context
  ): Promise<LaboratoryTest[]> {
    return await connection
      .getRepository(LaboratoryTest)
      .createQueryBuilder("lab_test")
      .leftJoinAndSelect("lab_test.card", "card")
      .where("card.name ILIKE :name", { name: `%${term}%` })
      .skip(skip)
      .take(take)
      .orderBy("lab_test.id", "DESC")
      .getMany();
  }

  @Mutation(() => LaboratoryTest)
  async createLaboratoryTest(
    @Arg("input") { totalPrice, cardId, result }: CreateLaboratoryTestInput,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    const laboratory_test = LaboratoryTest.create({
      result,
      card,
      price: totalPrice,
    });

    card.laboratory_tests?.unshift(laboratory_test);
    await card.save();
    await laboratory_test.save();

    const notification = await Notification.create({
      laboratory_test,
      for: [Occupation["RECEPTION"]],
      action: NotificationAction["CREATE"],
      message: `A laboratory test For ${card.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratory_test,
    });

    return laboratory_test;
  }
  @Mutation(() => LaboratoryTest)
  async completeLaboratoryTest(
    @Arg("id", () => ID!) id: number,
    @Arg("result", () => String!) result: string,
    @PubSub() pubsub: PubSubEngine
  ) {
    const laboratory_test = await LaboratoryTest.findOne(id, {
      relations: ["card"],
    });
    if (!laboratory_test) {
      return null;
    }
    await LaboratoryTest.update(
      { id },
      {
        completed: true,
        result,
      }
    );
    const notification = await Notification.create({
      laboratory_test,
      for: [Occupation["DOCTOR"]],
      action: NotificationAction["COMPLETE"],
      message: `A laboratory test For ${laboratory_test.card.name} was just completed!`,
    }).save();
    const deleteNotification = await Notification.findOne({
      where: {
        laboratory_test,
        action: "PAY_FOR_LABORATORY_TEST",
      },
    });

    await pubsub.publish(NEW_NOTIFICATION, { notification });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratory_test,
    });

    await Notification.delete({
      laboratory_test,
      action: NotificationAction["PAYMENT"],
    });

    return laboratory_test;
  }

  @Mutation(() => LaboratoryTest)
  async saveLaboratoryTest(
    @Arg("id", () => ID!) id: number,
    @Arg("result", () => String!) result: string
  ) {
    const laboratoryTest = await LaboratoryTest.findOne(id, {
      relations: ["card"],
    });
    if (!laboratoryTest) {
      return null;
    }
    await LaboratoryTest.update(
      { id },
      {
        result,
      }
    );
    return laboratoryTest;
  }
  @Mutation(() => LaboratoryTest)
  async payForLaboratoryTest(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const laboratory_test = await LaboratoryTest.findOne(id, {
      relations: ["card"],
    });
    if (!laboratory_test) {
      return null;
    }
    await LaboratoryTest.update(id, { paid: true });

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

    await pubsub.publish(NEW_NOTIFICATION, { notification });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratory_test,
    });
    await Notification.delete({
      laboratory_test,
      action: NotificationAction["CREATE"],
    });
    return laboratory_test;
  }
  @Mutation(() => Boolean)
  async deleteLaboratoryTest(@Arg("id", () => ID!) id: number) {
    await LaboratoryTest.delete(id);
    return true;
  }
  @Mutation(() => LaboratoryTest)
  async markLaboratoryTestAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const laboratory_test = await LaboratoryTest.findOne(id, {
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
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    await LaboratoryTest.update({ id }, { new: false });
    await Notification.delete({
      laboratory_test,
      action: NotificationAction["COMPLETE"],
    });

    return laboratory_test;
  }
  @Subscription(() => LaboratoryTest, {
    topics: NEW_CREATE_LABORATORY_TEST,
  })
  async newCreatedLaboratoryTest(
    @Root() { laboratoryTest }: { laboratoryTest: LaboratoryTest }
  ): Promise<LaboratoryTest> {
    console.log(laboratoryTest, "sub");
    return laboratoryTest;
  }
}
