import { AuthSource } from "../../auth/index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import { PointEntryResource } from "./PointEntry.js";
import { Resource } from "./Resource.js";
import { RoleResource } from "./Role.js";
import { TeamResource } from "./Team.js";

export class PersonResource extends Resource {
  userId!: string;

  authIds!: Partial<Record<AuthSource, string>>;

  firstName!: string | null;

  lastName!: string | null;

  email!: string;

  linkblue!: string | null;

  role!: RoleResource;

  memberOf!: TeamResource[] | string[];

  captainOf!: TeamResource[] | string[];

  pointEntries!: PointEntryResource[] | string[];

  constructor({
    userId,
    authIds,
    firstName,
    lastName,
    email,
    linkblue,
    role,
    memberOf,
    captainOf,
    pointEntries,
  }: PersonResourceInitializer) {
    super();
    this.userId = userId;
    this.authIds = authIds;
    this.firstName = firstName ?? null;
    this.lastName = lastName ?? null;
    this.email = email;
    this.linkblue = linkblue ?? null;
    this.role = role;
    this.memberOf = memberOf ?? [];
    this.captainOf = captainOf ?? [];
    this.pointEntries = pointEntries ?? [];
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.userId, errors);
    checkType("object", this.authIds, errors);
    for (const [key, value] of Object.entries(this.authIds)) {
      checkType("Enum", key, errors, {
        enumToCheck: AuthSource,
      });
      checkType("string", value, errors);
    }
    checkType("string", this.firstName, errors, { allowNull: true });
    checkType("string", this.lastName, errors, { allowNull: true });
    checkType("string", this.email, errors);
    checkType("string", this.linkblue, errors, { allowNull: true });
    checkType("Resource", this.role, errors, {
      classToCheck: RoleResource,
    });
    checkUnion(
      [
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
        {
          type: "Resource",
          options: {
            classToCheck: TeamResource,
            isArray: true,
          },
        },
      ],
      this.memberOf,
      errors,
      {}
    );
    checkUnion(
      [
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
        {
          type: "Resource",
          options: {
            classToCheck: TeamResource,
            isArray: true,
          },
        },
      ],
      this.captainOf,
      errors,
      {}
    );
    checkUnion(
      [
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
        {
          type: "Resource",
          options: {
            classToCheck: PointEntryResource,
            isArray: true,
          },
        },
      ],
      this.pointEntries,
      errors,
      {}
    );
    return errors;
  }
}

export interface PersonResourceInitializer {
  userId: PersonResource["userId"];
  authIds: PersonResource["authIds"];
  firstName?: PersonResource["firstName"];
  lastName?: PersonResource["lastName"];
  email: PersonResource["email"];
  linkblue?: PersonResource["linkblue"];
  role: PersonResource["role"];
  memberOf?: PersonResource["memberOf"];
  captainOf?: PersonResource["captainOf"];
  pointEntries?: PersonResource["pointEntries"];
}
