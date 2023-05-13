import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";
import type { TeamResource } from "./Team.js";
import { TeamType } from "./Team.js";
export class PointEntryResource extends Resource {
  entryId!: string;

  type!: TeamType;

  comment!: string;

  points!: number;

  personFrom!: PersonResource | string | null;

  team!: TeamResource | string;

  constructor({
    entryId,
    type,
    comment,
    points,
    personFrom,
    team,
  }: PointEntryResourceInitializer) {
    super();
    this.entryId = entryId;
    this.type = type;
    this.comment = comment;
    this.points = points;
    this.personFrom = personFrom ?? null;
    this.team = team;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.entryId, errors);
    checkType("Enum", this.type, errors, {
      enumToCheck: TeamType,
    });
    checkType("string", this.comment, errors);
    checkType("number", this.points, errors);
    return errors;
  }
}

export interface PointEntryResourceInitializer {
  entryId: PointEntryResource["entryId"];
  type: PointEntryResource["type"];
  comment: PointEntryResource["comment"];
  points: PointEntryResource["points"];
  personFrom: PointEntryResource["personFrom"];
  team: PointEntryResource["team"];
}
