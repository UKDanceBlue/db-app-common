import { Field, ID, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";

@ObjectType()
export class NotificationResource extends Resource {
  @Field(() => ID)
  notificationId!: string;
}
