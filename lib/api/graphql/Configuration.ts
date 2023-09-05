import { Field, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";

@ObjectType()
export class ConfigurationResource extends Resource {
  @Field(() => String)
  key!: string;
}
