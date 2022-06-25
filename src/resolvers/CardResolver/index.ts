import { Card } from "../../entities/Card";
import {
  Arg,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
  PubSub,
  PubSubEngine,
  Float,
  Args,
} from "type-graphql";
import { Between, ILike, Like } from "typeorm";
import { SearchField, CardProfileInput } from "./InputTypes";
import { Settings } from "../../entities/Settings";
import { CardSales } from "../../entities/CardSales";
import { Notification } from "../../entities/Notification";
import {
  DELETE_NOTIFICATION,
  NEW_CARD_CREATED,
  NEW_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { OffsetFieldsWithTime } from "../../utils/SharedInputTypes/OffsetFields";
import { GraphQLError } from "graphql";
import { NotificationAction, Occupation } from "../../utils/EnumTypes";

@Resolver()
export class CardsResolver {
  @Query(() => Float)
  async cardsCount(): Promise<number> {
    return await Card.count();
  }
  @Query(() => [Card])
  async cards(
    @Args() { skip, take, from, to }: OffsetFieldsWithTime
  ): Promise<Card[]> {
    return from && to
      ? await Card.find({
          order: { new: "DESC", valid: "DESC", updated_at: "DESC" },
          relations: ["payment", "history"],
          where: { created_at: from && to && Between(from, to) },
          skip,
          take,
        })
      : await Card.find({
          relations: ["payment", "history"],
          order: { new: "DESC", valid: "DESC", updated_at: "DESC" },
          skip,
          take,
        });
  }
  @Query(() => Card)
  async card(@Arg("id", () => ID!) id: number | string) {
    return await Card.findOne(id, {
      relations: [
        "laboratoryExaminations",
        "laboratoryExaminations.laboratoryTests",
        "laboratoryExaminations.laboratoryTests.category",
        "payment",
        "history",
        "prescriptions",
        "prescriptions.medications",
        "prescriptions.medications.medicine",
      ],
    });
  }
  @Query(() => [Card])
  searchCards(
    @Args()
    { name, phone, skip, take }: SearchField
  ): Promise<Card[]> {
    if (!name && phone) {
      return Card.find({
        where: {
          phone: Like(`%${phone}%`),
        },
        relations: ["payment", "history"],
        order: { new: "DESC", valid: "DESC", updated_at: "DESC" },
        skip,
        take,
      });
    }
    if (name && !phone) {
      return Card.find({
        where: {
          name: ILike(`%${name}%`),
        },
        order: { new: "DESC", valid: "DESC", updated_at: "DESC" },
        relations: ["payment", "history"],
        skip,
        take,
      });
    }
    return Card.find({
      where: {
        name: ILike(`%${name}%`),
        phone: Like(`%${phone}%`),
      },
      relations: ["payment", "history"],
      order: { new: "DESC", valid: "DESC", updated_at: "DESC" },
      skip,
      take,
    });
  }

  @Mutation(() => Card)
  async createCard(
    @Arg("profile") profile: CardProfileInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<Card> {
    const cardPrice = await Settings.findOne(1).then((res) => res?.card_price);

    if (!cardPrice) {
      throw new GraphQLError("No price in the settings");
    }
    const card = await Card.create({ ...profile }).save();

    await CardSales.create({
      card,
      price: cardPrice,
    }).save();

    const notification = await Notification.create({
      card,
      for: [Occupation["ADMIN"], Occupation["DOCTOR"]],
      action: NotificationAction["CREATE"],
      message: `A card For ${card.name} was just created!`,
    }).save();

    await pubsub.publish(NEW_CARD_CREATED, { card });
    await pubsub.publish(NEW_NOTIFICATION, { notification });

    return card;
  }
  @Mutation(() => Card)
  async updateCard(
    @Arg("profile") profile: CardProfileInput,
    @Arg("id", () => ID!) id: number
  ) {
    const card = await Card.findOne(id);
    if (!card) {
      return null;
    }
    await Card.update(id, { ...profile });

    return card;
  }
  @Mutation(() => Boolean)
  async deleteCard(@Arg("id", () => ID!) id: number) {
    await Card.delete(id);
    return true;
  }

  @Mutation(() => Card)
  async markCardAsNew(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const currentCardPrice = await Settings.findOne(1).then(
      (res) => res?.card_price
    );
    const card = await Card.findOne(id);
    if (!card) {
      return null;
    }
    if (!card.valid) {
      CardSales.create({ card, price: currentCardPrice }).save();
      await Card.update(id, {
        new: true,
        valid: true,
      });
    } else {
      await Card.update(id, {
        new: true,
      });
    }
    await card.reload();
    const notification = await Notification.create({
      card,
      action: NotificationAction["MARK_AS_NEW"],
      for: [Occupation["ADMIN"], Occupation["DOCTOR"]],
      message: `${card.name} just visited us Again!`,
    }).save();

    await pubsub.publish(NEW_CARD_CREATED, {
      card,
    });
    await pubsub.publish(NEW_NOTIFICATION, { notification });
    return card;
  }
  @Mutation(() => Card)
  async markCardAsSeen(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine
  ) {
    const card = await Card.findOne(id);
    if (!card) {
      return null;
    }
    const notification = await Notification.findOne({
      where: { card },
    });
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    await Notification.delete({ card });
    await Card.update(id, { new: false });
    await card.reload();
    return card;
  }
  @Mutation(() => Card)
  async invalidateCard(@Arg("id", () => ID!) id: number) {
    const card = await Card.findOne(id);
    if (!card) {
      return null;
    }

    await Card.update(id, { valid: false, new: false });
    await card.reload();
    return card;
  }

  @Subscription(() => Card, {
    topics: NEW_CARD_CREATED,
  })
  async newCreatedCard(
    @Root() { card }: { card: Card }
  ): Promise<Card | undefined> {
    return await Card.findOne(card.id, {
      relations: ["payment"],
    });
  }
}
