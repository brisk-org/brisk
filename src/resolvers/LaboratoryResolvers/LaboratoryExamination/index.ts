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
  PubSub,
  PubSubEngine,
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
import { LaboratoryTestRequest } from "../../../entities/LaboratoryTestRequest";
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
      relations: [
        "card",
        "laboratoryTestRequests",
        "laboratoryTestRequests.laboratoryTest",
      ],
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
        "laboratoryTestRequests",
        "laboratoryTestRequests.laboratoryTest",
      ],
    });
  }

  @Query(() => [LaboratoryExamination])
  async searchLaboratoryExamination(
    @Args() { term, skip, take }: SearchAndOffsetFields,
    @Ctx() { connection }: Context
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
      laboratoryTestRequest: laboratoryTestRequestArgs,
    }: CreateLaboratoryExaminationArgs,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }
    const laboratoryTestRequests = LaboratoryTestRequest.create([
      ...laboratoryTestRequestArgs,
    ]);
    console.log(laboratoryTestRequests);

    for (let i = 0; i < laboratoryTestRequests.length; i++) {
      await laboratoryTestRequests[i].save();
    }

    const laboratoryExamination = LaboratoryExamination.create({
      laboratoryTestRequests,
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

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
      laboratoryTest: laboratoryExamination,
    });

    return laboratoryExamination;
  }
  @Mutation(() => LaboratoryExamination)
  async completeLaboratoryExamination(
    @Arg("id", () => ID!) id: number,
    @Arg("content", () => [CompleteLaboratoryExaminationInput])
    laboratoryRequestsArgs: CompleteLaboratoryExaminationInput[],
    @PubSub() pubsub: PubSubEngine
  ) {
    const laboraotryExamination = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboraotryExamination) {
      return null;
    }
    for (let i = 0; i < laboratoryRequestsArgs.length; i++) {
      await LaboratoryTestRequest.update(laboratoryRequestsArgs[i].id, {
        value: laboratoryRequestsArgs[i].value,
      });
    }

    await LaboratoryExamination.update(
      { id },
      {
        completed: true,
        // result,
      }
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

    await pubsub.publish(NEW_NOTIFICATION, { notification });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await pubsub.publish(NEW_CREATE_LABORATORY_TEST, {
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
    laboratoryRequestsArgs: CompleteLaboratoryExaminationInput[]
  ) {
    const laboratoryExamination = await LaboratoryExamination.findOne(id, {
      relations: ["card"],
    });
    if (!laboratoryExamination) {
      return null;
    }
    for (let i = 0; i < laboratoryRequestsArgs.length; i++) {
      await LaboratoryTestRequest.update(laboratoryRequestsArgs[i].id, {
        value: laboratoryRequestsArgs[i].value,
      });
    }
    console.log(laboratoryExamination);
    await laboratoryExamination.reload();
    console.log(laboratoryExamination);

    return laboratoryExamination;
  }
  @Mutation(() => LaboratoryExamination)
  async payForLaboratoryExamination(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
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
  async deleteLaboratoryExamination(@Arg("id", () => ID!) id: number) {
    await LaboratoryExamination.delete(id);
    return true;
  }
  @Mutation(() => LaboratoryExamination)
  async markLaboratoryExaminationAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
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
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
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
    @Root() { laboratoryTest }: { laboratoryTest: LaboratoryExamination }
  ): Promise<LaboratoryExamination> {
    console.log(laboratoryTest, "sub");
    return laboratoryTest;
  }
}
