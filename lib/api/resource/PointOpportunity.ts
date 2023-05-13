import type { DateTime } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";
import type { TeamResource } from "./Team.js";
import { TeamType } from "./Team.js";
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
}

export interface PointOpportunityResourceInitializer {
  entryId: PointOpportunityResource["entryId"];
  type: PointOpportunityResource["type"];
  name: PointOpportunityResource["name"];
  opportunityDate?: PointOpportunityResource["opportunityDate"];
  personFrom?: PointOpportunityResource["personFrom"];
  team: PointOpportunityResource["team"];
}
