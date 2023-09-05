import type { DateTime, Duration } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { ImageResource } from "./Image.js";
import { Resource } from "./Resource.js";
import { DateTimeScalar } from "../custom-scalars/DateTimeScalar.js";
import { DurationScalar } from "../custom-scalars/DurationScalar.js";

@ObjectType()
export class EventResource extends Resource {
  @Field(() => ID)
  eventId!: string;
  @Field(() => [ImageResource], { nullable: true })
  images!: ImageResource[] | string[] | null;
  @Field(() => [DateTimeScalar])
  occurrences!: DateTime[];
  @Field(() => DurationScalar, { nullable: true })
  duration!: Duration | null;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  summary!: string | null;
  @Field(() => String, { nullable: true })
  description!: string | null;
  @Field(() => String, { nullable: true })
  location!: string | null;
}
