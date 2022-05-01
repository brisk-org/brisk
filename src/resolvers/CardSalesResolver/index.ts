import { Resolver, Query } from "type-graphql";
import { CardSales } from "../../entities/CardSales";

@Resolver()
export class CardSalesResolver {
  @Query(() => [CardSales])
  cardSales(): Promise<CardSales[]> {
    return CardSales.find({
      relations: ["card"],
    });
  }
}
