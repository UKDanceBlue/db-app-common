import type { DbRole } from "../../index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import { PersonResource } from "./Person.js";
import { PointEntryResource } from "./PointEntry.js";
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
