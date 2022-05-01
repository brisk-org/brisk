import { Product } from "../../entities/Product";
import {
  Arg,
  ID,
  Mutation,
  Query,
  Resolver,
  PubSub,
  PubSubEngine,
  Float,
  Args,
} from "type-graphql";
import { ILike } from "typeorm";
import { SearchField, CreateProductInput } from "./InputTypes";
import { Notification } from "../../entities/Notification";
import {
  NEW_CARD_CREATED,
  NEW_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import { OffsetFields } from "../../utils/SharedInputTypes/OffsetFields";

@Resolver()
export class ProductResolver {
  @Query(() => Float)
  async productsCount(): Promise<number> {
    return await Product.count();
  }
  @Query(() => [Product])
  async products(@Args() { skip, take }: OffsetFields): Promise<Product[]> {
    return await Product.find({
      relations: ["payment", "history"],
      order: { updated_at: "DESC" },
      skip,
      take,
    });
  }
  @Query(() => Product)
  async product(@Arg("id", () => ID!) id: number | string) {
    return await Product.findOne(id);
  }
  @Query(() => [Product])
  searchProducts(
    @Args()
    { name, skip, take }: SearchField
  ): Promise<Product[]> {
    return Product.find({
      where: {
        name: ILike(`%${name}%`),
      },
      order: { updated_at: "DESC" },
      skip,
      take,
    });
  }
  @Mutation(() => Product)
  async createProduct(
    @Arg("product") profile: CreateProductInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<Product> {
    const product = await Product.create({ ...profile }).save();

    const notification = await Notification.create({
      card_id: product.id,
      action: "PRODUCT_CARD",
      desc: `A product ${product.name} was added in the store!`,
    }).save();

    await pubsub.publish(NEW_CARD_CREATED, { card: product });
    await pubsub.publish(NEW_NOTIFICATION, { notification });

    return product;
  }
}
