import { Notification } from "../../entities/Notification";
import {
  Arg,
  ID,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import {
  NEW_NOTIFICATION,
  DELETE_NOTIFICATION,
} from "../../constants/subscriptionTriggername";

@Resolver()
export class NotificationResolver {
  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return await Notification.find();
  }
  @Mutation(() => Boolean)
  async deleteNotification(
    @Arg("id", () => ID!) id: number,
    @PubSub() pubsub: PubSubEngine,
  ): Promise<boolean> {
    const notification = await Notification.findOne(id);
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification,
    });
    return !!(await Notification.delete(id)).affected;
  }
  @Mutation(() => Boolean)
  async clearNotification(@PubSub() pubsub: PubSubEngine): Promise<boolean> {
    await pubsub.publish(DELETE_NOTIFICATION, {
      notification: [],
    });
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
