import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";
import { DateTimeScalar } from "./custom-scalars/DateTimeScalar.js";

@ObjectType()
export class DeviceResource extends Resource {
  @Field(() => ID)
  deviceId!: string;
  @Field(() => String, { nullable: true })
  public expoPushToken!: string | null;
  @Field(() => PersonResource, { nullable: true })
  public lastUser!: PersonResource | null;
  @Field(() => DateTimeScalar, { nullable: true })
  public lastLogin!: DateTime | null;
}
