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
import { CreatePrescriptionArgs } from "./InputType";
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
  async prescriptionCount(): Promise<number> {
    return await Prescription.count();
  }
  @Query(() => [Prescription])
  async prescriptions(@Args() { skip, take }: OffsetFieldsWithTime) {
    return await Prescription.find({
      relations: ["card"],
      order: { updated_at: "DESC", inrolled: "DESC", id: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => Prescription)
  async prescription(@Arg("id", () => ID!) id: number | string) {
    return await Prescription.findOne(id, {
      relations: ["card"],
    });
  }
  @Query(() => [Prescription])
  async searchPrescriptions(
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
  async createPrescription(
    @Args() { totalPrice, cardId, rx }: CreatePrescriptionArgs,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    const prescription = Prescription.create({
      card,
      price: totalPrice,
      rx,
    });

    card.prescriptions?.unshift(prescription);
    await card.save();
    await prescription.save();

    const notification = await Notification.create({
      prescription_id: prescription.id,
      action: "CREATE_PRESCRIPTION",
      desc: `A prescription test For ${card.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescription,
    });

    return prescription;
  }

  // @Mutation(() => Prescription)
  // async markPrescriptionTestAsCompleted(
  //   @Arg("main") { id, result, done: completed }: UpdatePrescriptionTestInput,
  //   @PubSub() pubsub: PubSubEngine
  // ) {
  //   const prescription = await Prescription.findOne(id, {
  //     relations: ["card"],
  //   });
  //   if (!prescription) {
  //     return null;
  //   }
  //   await Prescription.update(
  //     { id },
  //     {
  //       inrolled: !completed,
  //       completed,
  //       result: JSON.stringify(result),
  //     }
  //   );
  //   const notification = await Notification.create({
  //     prescription_test_id: prescription.id,
  //     action: "COMPLETE_PRESCRIPTION_TEST",
  //     desc: `A prescription test For ${prescription.card.name} was just completed!`,
  //   }).save();

  //   await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
  //     prescription,
  //   });
  //   await pubsub.publish(NEW_NOTIFICATION, { notification });
  //   const deleteNotification = await Notification.findOne({
  //     where: {
  //       prescription_test_id: prescription.id,
  //       action: "PAY_FOR_PRESCRIPTION_TEST",
  //     },
  //   });
  //   await pubsub.publish(DELETE_NOTIFICATION, {
  //     notification: deleteNotification,
  //   });
  //   await Notification.delete({
  //     prescription_test_id: prescription.id,
  //     action: "PAY_FOR_PRESCRIPTION_TEST",
  //   });
  //   return prescription;
  // }
  // @Mutation(() => Prescription)
  // async markPrescriptionTestAsPaid(
  //   @Arg("main") { id, result, done: paid }: UpdatePrescriptionTestInput,
  //   @PubSub() pubsub: PubSubEngine
  // ) {
  //   const prescription = await Prescription.findOne(id, {
  //     relations: ["card"],
  //   });
  //   if (!prescription) {
  //     return null;
  //   }

  //   await Prescription.update(id, {
  //     paid,
  //     inrolled: true,
  //     result: JSON.stringify(result),
  //   });

  //   const notification = await Notification.create({
  //     prescription_test_id: prescription.id,
  //     action: "PAY_FOR_PRESCRIPTION_TEST",
  //     desc: ` ${prescription.card.name} just paid for the Prescription Test!`,
  //   }).save();
  //   const deleteNotification = await Notification.findOne({
  //     where: {
  //       prescription_test_id: prescription.id,
  //       action: "CREATE_PRESCRIPTION_TEST",
  //     },
  //   });

  //   await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
  //     prescription,
  //   });
  //   await pubsub.publish(NEW_NOTIFICATION, { notification });
  //   await pubsub.publish(DELETE_NOTIFICATION, {
  //     notification: deleteNotification,
  //   });

  //   await Notification.delete({
  //     prescription_test_id: prescription.id,
  //     action: "CREATE_PRESCRIPTION_TEST",
  //   });

  //   return prescription;
  // }
  @Mutation(() => Boolean)
  async deletePrescription(@Arg("id", () => ID!) id: number) {
    await Prescription.delete(id);
    return true;
  }
  @Mutation(() => Prescription)
  async markPrescriptionAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescription = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescription) {
      return null;
    }
    await Prescription.update({ id }, { new: false });
    const notification = await Notification.findOne({
      where: {
        prescription_test_id: prescription.id,
        action: "COMPLETE_PRESCRIPTION_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    await Notification.delete({
      prescription_id: prescription.id,
      action: "COMPLETE_PRESCRIPTION",
    });

    return prescription;
  }
  @Subscription(() => Prescription, {
    topics: NEW_CREATE_PRESCRIPTION,
  })
  async newCreatedPrescription(
    @Root() { prescription }: { prescription: Prescription }
  ): Promise<Prescription> {
    return prescription;
  }
}
