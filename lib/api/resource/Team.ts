import type { DbRole } from "../../index.js";
import { isArrayOf } from "../../index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import type { PlainPerson } from "./Person.js";
import { PersonResource } from "./Person.js";
import type { PlainPointEntry } from "./PointEntry.js";
import { PointEntryResource } from "./PointEntry.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";

export enum TeamType {
  Spirit = "Spirit",
  Morale = "Morale",
}

export class TeamResource extends Resource {
  teamId!: string;

  name!: string;

  type!: TeamType;

  visibility!: DbRole;

  members!: PersonResource[] | string[];

  captains!: PersonResource[] | string[];

  pointEntries!: PointEntryResource[] | string[];

  constructor({
    teamId,
    name,
    type,
    visibility,
    members,
    captains,
    pointEntries,
  }: TeamResourceInitializer) {
    super();
    this.teamId = teamId;
    this.name = name;
    this.type = type;
    this.visibility = visibility;
    this.members = members;
    this.captains = captains;
    this.pointEntries = pointEntries;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.teamId, errors);
    checkType("string", this.name, errors);
    checkType("string", this.type, errors);
    checkType("string", this.visibility, errors);
    checkUnion(
      [
        {
          type: "Resource",
          options: {
            classToCheck: PersonResource,
            isArray: true,
          },
        },
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
      ],
      this.members,
      errors
    );
    checkUnion(
      [
        {
          type: "Resource",
          options: {
            classToCheck: PersonResource,
            isArray: true,
          },
        },
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
      ],
      this.captains,
      errors
    );
    checkUnion(
      [
        {
          type: "Resource",
          options: {
            classToCheck: PointEntryResource,
            isArray: true,
          },
        },
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
      ],
      this.pointEntries,
      errors
    );
    return errors;
  }

  public toPlain(): PlainTeam {
    const members = isArrayOf(this.members, "string")
      ? this.members
      : this.members.map((i) => i.toPlain());
    const captains = isArrayOf(this.captains, "string")
      ? this.captains
      : this.captains.map((i) => i.toPlain());
    const pointEntries = isArrayOf(this.pointEntries, "string")
      ? this.pointEntries
      : this.pointEntries.map((i) => i.toPlain());

    return {
      teamId: this.teamId,
      name: this.name,
      type: this.type,
      visibility: this.visibility,
      members,
      captains,
      pointEntries,
    };
  }

  public static fromPlain(plain: PlainTeam): TeamResource {
    const members = isArrayOf(plain.members, "string")
      ? plain.members
      : plain.members.map((i) => PersonResource.fromPlain(i));
    const captains = isArrayOf(plain.captains, "string")
      ? plain.captains
      : plain.captains.map((i) => PersonResource.fromPlain(i));
    const pointEntries = isArrayOf(plain.pointEntries, "string")
      ? plain.pointEntries
      : plain.pointEntries.map((i) => PointEntryResource.fromPlain(i));

    return new TeamResource({
      teamId: plain.teamId,
      name: plain.name,
      type: plain.type,
      visibility: plain.visibility,
      members,
      captains,
      pointEntries,
    });
  }
}

export interface PlainTeam
  extends PlainResourceObject<TeamResourceInitializer> {
  teamId: string;
  name: string;
  type: TeamType;
  visibility: DbRole;
  members: PlainPerson[] | string[];
  captains: PlainPerson[] | string[];
  pointEntries: PlainPointEntry[] | string[];
}

export interface TeamResourceInitializer {
  teamId: string;
  name: string;
  type: TeamType;
  visibility: DbRole;
  members: PersonResource[] | string[];
  captains: PersonResource[] | string[];
  pointEntries: PointEntryResource[] | string[];
}

TeamResource satisfies ResourceStatic<TeamResource, PlainTeam>;
