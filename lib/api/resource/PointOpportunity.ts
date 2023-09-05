import { DateTime } from "luxon";
import { Field, ID, ObjectType, buildSchema } from "type-graphql";

import { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";
import { TeamResource, TeamType } from "./Team.js";

@ObjectType()
export class PointOpportunityResource extends Resource {
  @Field(() => ID)
  entryId!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => String)
  name!: string;
  @Field(() => DateTime, { nullable: true })
  opportunityDate!: DateTime | null;
  @Field(() => PersonResource, { nullable: true })
  personFrom!: PersonResource | null;
  @Field(() => TeamResource)
  team!: TeamResource;
}

function test(t: ObjectType)