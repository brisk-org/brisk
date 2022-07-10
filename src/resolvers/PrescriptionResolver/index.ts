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
  UPDATE_PRESCRIPTION_CHECKIN,
} from "../../constants/subscriptionTriggername";
import { Notification } from "../../entities/Notification";
import { MedicationsCheckInInput } from "../MedicationResolver/InputType";
import { NotificationAction, Occupation } from "../../utils/EnumTypes";
import { Medication } from "../../entities/Medication";
import { Medicine } from "../../entities/Medicine";

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
      relations: ["card", "medications", "medications.medicine"],
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
    @Args()
    { price, cardId, medications: medicationArg, rx }: CreatePrescriptionArgs,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card Not Defined or was Deleted");
    }

    const medications = Medication.create([...medicationArg]);

    for (let i = 0; i < medications.length; i++) {
      await medications[i].save();
    }
    const prescription = Prescription.create({
      card,
      price,
      medications,
      rx,
    });

    card.prescriptions?.unshift(prescription);
    await card.save();
    await prescription.save();

    const notification = await Notification.create({
      prescription,
      for: [Occupation["RECEPTION"]],
      action: NotificationAction["CREATE"],
      message: `A prescription test For ${card.name} was just requested!`,
    }).save();

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescription,
    });

    return prescription;
  }

  @Mutation(() => Prescription)
  async markPrescriptionAsCompleted(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescription = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescription) {
      return null;
    }
    await Prescription.update(
      { id },
      {
        completed: true,
        inrolled: false,
      }
    );
    const notification = await Notification.create({
      prescription,
      for: [Occupation["DOCTOR"]],
      action: NotificationAction["COMPLETE"],
      message: `A prescription test For ${prescription.card.name} was just completed!`,
    }).save();

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescription,
    });
    await pubsub.publish(NEW_NOTIFICATION, { notification });
    const deleteNotification = await Notification.findOne({
      where: {
        prescription: {
          id: prescription.id,
        },
        action: NotificationAction.PAYMENT,
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });
    await Notification.delete({
      prescription,
      action: NotificationAction["PAYMENT"],
    });
    return prescription;
  }
  @Mutation(() => Prescription)
  async updatePrescriptionCheckIn(
    @Arg("id", () => ID!) id: number,
    @Arg("medicationsCheckIn", () => [MedicationsCheckInInput])
    medicationsCheckIn: MedicationsCheckInInput[],
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescription = await Prescription.findOne(id, {
      relations: ["card", "medications", "medications.medicine"],
    });
    const medications = await Medication.find({
      where: { prescription: { id } },
      relations: ["medicine"],
    });
    if (!medications || !prescription) {
      return;
    }
    for (let i = 0; i < medications.length; i++) {
      for (let j = 0; j < medicationsCheckIn.length; j++) {
        const medicine = await Medicine.findOne({
          where: { name: medications[i].medicine.name },
        });
        console.log(medicine);
        if (
          !medicine ||
          medications[i].medicine.name !== medicationsCheckIn[j].name
        )
          continue;

        const previousCompletedMedication = medications[i].checkIn.reduce(
          (prev, curr) =>
            prev +
            curr.status.reduce(
              (prev, curr) => (curr.isCompleted ? prev + 1 : prev),
              0
            ),
          0
        );
        const curentCompletedMedication = medicationsCheckIn[i].checkIn.reduce(
          (prev, curr) =>
            prev +
            curr.status.reduce(
              (prev, curr) => (curr.isCompleted ? prev + 1 : prev),
              0
            ),
          0
        );
        console.log(previousCompletedMedication, curentCompletedMedication);
        medicine.inStock =
          medicine.inStock -
          (curentCompletedMedication - previousCompletedMedication);
        await medicine?.save();
        medications[i].checkIn = medicationsCheckIn[j].checkIn;
      }
      await medications[i].save();
    }
    const completed = medicationsCheckIn.every(({ checkIn }) =>
      checkIn.every((checkIn) =>
        checkIn.status.every((status) => status.isCompleted)
      )
    );
    const paid = medicationsCheckIn.every(({ checkIn }) =>
      checkIn.every((checkIn) =>
        checkIn.status.every((status) => status.isPaid)
      )
    );
    prescription.inrolled = !(paid && completed);
    prescription.completed = completed;
    prescription.paid = paid;
    await prescription.save();

    const notification = await Notification.create({
      prescription,
      action: NotificationAction["CHECK_IN"],
      for: [Occupation["NURSE"], Occupation["DOCTOR"]],
      message: ` ${prescription?.card.name} proceded with the CheckIn!`,
    }).save();
    await pubsub.publish(UPDATE_PRESCRIPTION_CHECKIN, {
      prescription,
    });

    await pubsub.publish(NEW_NOTIFICATION, { notification });

    return prescription;
  }
  @Mutation(() => Prescription)
  async markPrescriptionAsPaid(
    @Arg("id", () => ID!) id: number,
    @Arg("paid") paid: boolean,
    @PubSub() pubsub: PubSubEngine
  ) {
    const prescription = await Prescription.findOne(id, {
      relations: ["card"],
    });
    if (!prescription) {
      return null;
    }

    await Prescription.update(id, {
      paid,
      inrolled: true,
    });

    const notification = await Notification.create({
      prescription,
      for: [Occupation.NURSE],
      action: NotificationAction["PAYMENT"],
      message: ` ${prescription.card.name} just paid for the Prescription Test!`,
    }).save();
    const deleteNotification = await Notification.findOne({
      where: {
        prescription,
        action: "CREATE_PRESCRIPTION_TEST",
      },
    });

    await pubsub.publish(NEW_CREATE_PRESCRIPTION, {
      prescription,
    });
    await pubsub.publish(NEW_NOTIFICATION, { notification });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: deleteNotification,
    });

    await Notification.delete({
      prescription,
      action: NotificationAction["CREATE"],
    });

    return prescription;
  }
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
        prescription,
        action: "COMPLETE_PRESCRIPTION_TEST",
      },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    await Notification.delete({
      prescription,
      action: NotificationAction["COMPLETE"],
    });

    return prescription;
  }
  @Subscription(() => Prescription, {
    topics: UPDATE_PRESCRIPTION_CHECKIN,
  })
  async newMedicationUpdate(
    @Root() { prescription }: { prescription: Prescription[] }
  ): Promise<Prescription[]> {
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
