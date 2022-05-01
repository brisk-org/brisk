import { Resolver, Arg, ID, Mutation, Query } from "type-graphql";
import { History } from "../../entities/History";
import { Card } from "../../entities/Card";
import { Between } from "typeorm";

@Resolver()
export class HistoryResolver {
  @Query(() => [History])
  async histories(): Promise<History[]> {
    return await History.find({
      relations: ["card"],
    });
  }
  @Query(() => [History])
  async weeklyHistory(
    @Arg("startingDate") startingDate: string,
    @Arg("endingDate") endingDate: string
  ): Promise<History[]> {
    const history = await History.find({
      relations: ["card"],
      where: { created_at: Between(startingDate, endingDate) },
    });
    return history;
  }
  @Query(() => History)
  async history(
    @Arg("id", () => ID!) id: number | string
  ): Promise<History | undefined> {
    return await History.findOne(id);
  }
  @Mutation(() => History)
  async createHistory(
    @Arg("id", () => ID!) id: number,
    @Arg("result") result: string
  ) {
    const card = await Card.findOne(id);
    return await History.create({
      card,
      result,
    }).save();
  }

  @Mutation(() => History)
  async updateHistory(
    @Arg("id", () => ID!) id: number,
    @Arg("result") result: string
  ) {
    const history = await History.findOne(id);
    if (!history) {
      return null;
    }
    await History.update(id, {
      result,
    });
    return history;
  }
  @Mutation(() => Boolean)
  async deleteHistory(@Arg("id", () => ID!) id: number) {
    await History.delete(id);
    return true;
  }
}
