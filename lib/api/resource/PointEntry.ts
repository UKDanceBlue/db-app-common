import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainPerson } from "./Person.js";
import { PersonResource } from "./Person.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";
import type { PlainTeam } from "./Team.js";
import { TeamResource, TeamType } from "./Team.js";
export class PointEntryResource extends Resource {
  entryId!: string;

  type!: TeamType;

  comment!: string | null;

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

  public toPlain(): PlainPointEntry {
    return {
      entryId: this.entryId,
      type: this.type,
      comment: this.comment,
      points: this.points,
      personFrom:
        typeof this.personFrom === "string"
          ? this.personFrom
          : this.personFrom?.toPlain() ?? null,
      team: typeof this.team === "string" ? this.team : this.team.toPlain(),
    };
  }

  public static fromPlain(plain: PlainPointEntry): PointEntryResource {
    let personFrom: PersonResource | string | null = null;
    if (plain.personFrom !== null) {
      personFrom =
        typeof plain.personFrom === "string"
          ? plain.personFrom
          : PersonResource.fromPlain(plain.personFrom);
    }
    const team =
      typeof plain.team === "string"
        ? plain.team
        : TeamResource.fromPlain(plain.team);
    return new PointEntryResource({
      entryId: plain.entryId,
      type: plain.type,
      comment: plain.comment,
      points: plain.points,
      personFrom,
      team,
    });
  }
}

export interface PlainPointEntry
  extends PlainResourceObject<PointEntryResourceInitializer> {
  entryId: string;
  type: TeamType;
  comment: string | null;
  points: number;
  personFrom: PlainPerson | string | null;
  team: PlainTeam | string;
}

export interface PointEntryResourceInitializer {
  entryId: PointEntryResource["entryId"];
  type: PointEntryResource["type"];
  comment: PointEntryResource["comment"];
  points: PointEntryResource["points"];
  personFrom: PointEntryResource["personFrom"];
  team: PointEntryResource["team"];
}

PointEntryResource satisfies ResourceStatic<
  PointEntryResource,
  PlainPointEntry
>;
