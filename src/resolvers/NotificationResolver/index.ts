import { Notification } from "../../entities/Notification";
import {
  Arg,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import {
  NEW_NOTIFICATION,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";
import Context from "../../../src/constants/Context";

@Resolver()
export class NotificationResolver {
  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return await Notification.find();
  }
  @Mutation(() => Boolean)
  async deleteNotification(
    @Arg("id", () => ID!) id: number,
    @Ctx() { pubsub }: Context,
  ): Promise<boolean> {
    const notification = await Notification.findOne(id);
    pubsub.publish(DELETE_NOTIFICATION, {
      notification: notification!,
    });
    return !!(await Notification.delete(id)).affected;
  }
  @Mutation(() => Boolean)
  async clearNotification(): Promise<boolean> {
    // pubsub.publish(DELETE_NOTIFICATION, {
    //   notification: [],
    // });
    console.log("clear");
    return !!(await Notification.delete({})).affected;
  }
  @Subscription(() => Notification, {
    topics: NEW_NOTIFICATION,
  })
  async newNotificationSubscription(
    @Root() { notification }: { notification: Notification },
  ): Promise<Notification> {
    return notification;
  }
  @Subscription(() => Notification, {
    topics: DELETE_NOTIFICATION,
  })
  async deleteNotificationSubscription(
    @Root() { notification }: { notification: Notification },
  ): Promise<Notification> {
    console.log(notification);
    return notification;
  }
}
