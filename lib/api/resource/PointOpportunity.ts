import { DateTime } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainPerson } from "./Person.js";
import { PersonResource } from "./Person.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";
import type { PlainTeam } from "./Team.js";
import { TeamResource, TeamType } from "./Team.js";
export class PointOpportunityResource extends Resource {
  entryId!: string;

  type!: TeamType;

  name!: string;

  opportunityDate!: DateTime | null;

  personFrom!: PersonResource | string | null;

  team!: TeamResource | string;

  constructor({
    entryId,
    type,
    name,
    opportunityDate,
    personFrom,
    team,
  }: PointOpportunityResourceInitializer) {
    super();
    this.entryId = entryId;
    this.type = type;
    this.name = name;
    this.opportunityDate = opportunityDate ?? null;
    this.personFrom = personFrom ?? null;
    this.team = team;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.entryId, errors);
    checkType("Enum", this.type, errors, {
      enumToCheck: TeamType,
    });
    checkType("string", this.name, errors);
    return errors;
  }

  public toPlain(): PlainPointOpportunity {
    let personFrom: PlainPerson | string | null = null;
    if (this.personFrom != null) {
      personFrom =
        typeof this.personFrom === "string"
          ? this.personFrom
          : this.personFrom.toPlain();
    }
    const team =
      typeof this.team === "string" ? this.team : this.team.toPlain();

    return {
      entryId: this.entryId,
      type: this.type,
      name: this.name,
      opportunityDate: this.opportunityDate?.toISO() ?? null,
      personFrom,
      team,
    };
  }

  public static fromPlain(
    plain: PlainPointOpportunity
  ): PointOpportunityResource {
    let personFrom: PersonResource | string | null = null;
    if (plain.personFrom != null) {
      personFrom =
        typeof plain.personFrom === "string"
          ? plain.personFrom
          : PersonResource.fromPlain(plain.personFrom);
    }
    const team =
      typeof plain.team === "string"
        ? plain.team
        : TeamResource.fromPlain(plain.team);
    return new PointOpportunityResource({
      entryId: plain.entryId,
      type: plain.type,
      name: plain.name,
      opportunityDate:
        plain.opportunityDate == null
          ? null
          : DateTime.fromISO(plain.opportunityDate),
      personFrom,
      team,
    });
  }

  static graphqlType = `#graphql
    type PointOpportunity {
      entryId: ID!
      type: TeamType!
      name: String!
      opportunityDate: String
      personFrom: Person
      team: Team!
    }
  `;

  static graphqlQueries = `#graphql
    pointOpportunity(entryId: ID!): PointOpportunity
    pointOpportunities: [PointOpportunity!]!
  `;
}

export interface PlainPointOpportunity
  extends PlainResourceObject<PointOpportunityResourceInitializer> {
  entryId: string;
  type: TeamType;
  name: string;
  opportunityDate: string | null;
  personFrom: PlainPerson | string | null;
  team: PlainTeam | string;
}

export interface PointOpportunityResourceInitializer {
  entryId: PointOpportunityResource["entryId"];
  type: PointOpportunityResource["type"];
  name: PointOpportunityResource["name"];
  opportunityDate?: PointOpportunityResource["opportunityDate"];
  personFrom?: PointOpportunityResource["personFrom"];
  team: PointOpportunityResource["team"];
}

PointOpportunityResource satisfies ResourceStatic<
  PointOpportunityResource,
  PlainPointOpportunity
>;
