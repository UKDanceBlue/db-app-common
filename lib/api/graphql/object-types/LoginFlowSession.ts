import { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../custom-scalars/DateTimeScalar.js";
import { UrlScalar } from "../custom-scalars/UrlScalar.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class LoginFlowSessionResource extends Resource {
  @Field(() => ID)
  sessionId!: string;
  @Field(() => String)
  codeVerifier!: string;
  @Field(() => DateTimeScalar)
  creationDate!: DateTime;
  @Field(() => UrlScalar, { nullable: true })
  redirectToAfterLogin!: URL | null;
}
