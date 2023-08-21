import type { UserData } from "../../auth/index.js";
import { AuthSource } from "../../auth/index.js";
import { roleToAuthorization } from "../../auth/role.js";
import { isArrayOf } from "../../index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";
import type { PlainRole } from "./Role.js";
import { RoleResource } from "./Role.js";
import type { PlainTeam } from "./Team.js";
import { TeamResource } from "./Team.js";

export class PersonResource extends Resource {
  personId!: string;

  authIds!: Partial<Record<AuthSource, string>>;

  firstName!: string | null;

  lastName!: string | null;

  email!: string;

  linkblue!: string | null;

  role!: RoleResource;

  memberOf!: TeamResource[] | string[];

  captainOf!: TeamResource[] | string[];

  constructor({
    personId: userId,
    authIds,
    firstName,
    lastName,
    email,
    linkblue,
    role,
    memberOf,
    captainOf,
  }: PersonResourceInitializer) {
    super();
    this.personId = userId;
    this.authIds = authIds;
    this.firstName = firstName ?? null;
    this.lastName = lastName ?? null;
    this.email = email;
    this.linkblue = linkblue ?? null;
    this.role = role;
    this.memberOf = memberOf ?? [];
    this.captainOf = captainOf ?? [];
  }

  toUserData(): UserData {
    const userData: UserData = {
      userId: this.personId,
      auth: roleToAuthorization(this.role),
    };
    userData.teamIds = this.memberOf.map((team) =>
      typeof team === "string" ? team : team.teamId
    );
    userData.captainOfTeamIds = this.captainOf.map((team) =>
      typeof team === "string" ? team : team.teamId
    );
    return userData;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.personId, errors);
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
    return errors;
  }

  public toPlain(): PlainPerson {
    const memberOf = isArrayOf(this.memberOf, "string")
      ? this.memberOf
      : this.memberOf.map((i) => i.toPlain());
    const captainOf = isArrayOf(this.captainOf, "string")
      ? this.captainOf
      : this.captainOf.map((i) => i.toPlain());
    return {
      personId: this.personId,
      authIds: this.authIds,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      linkblue: this.linkblue,
      role: this.role.toPlain(),
      memberOf,
      captainOf,
    };
  }

  public static fromPlain(plain: PlainPerson): PersonResource {
    const memberOf = isArrayOf(plain.memberOf, "string")
      ? plain.memberOf
      : plain.memberOf.map((i) => TeamResource.fromPlain(i));
    const captainOf = isArrayOf(plain.captainOf, "string")
      ? plain.captainOf
      : plain.captainOf.map((i) => TeamResource.fromPlain(i));
    return new PersonResource({
      personId: plain.personId,
      authIds: plain.authIds,
      firstName: plain.firstName,
      lastName: plain.lastName,
      email: plain.email,
      linkblue: plain.linkblue,
      role: RoleResource.fromPlain(plain.role),
      memberOf,
      captainOf,
    });
  }

  static graphqlType = `#graphql
    type AuthSource {
      ${Object.values(AuthSource)
        .map((source) => `${source}: String`)
        .join("\n")}
    }
    type Person {
      personId: ID!
      authIds: AuthSource!
      firstName: String
      lastName: String
      email: String!
      linkblue: String
      role: Role!
      memberOf: [Team!]!
      captainOf: [Team!]!
    }
  `;

  static graphqlQueries = `#graphql
    person(personId: ID!): Person
    people: [Person!]!
  `;
}

export interface PlainPerson
  extends PlainResourceObject<PersonResourceInitializer> {
  personId: string;
  authIds: Partial<Record<AuthSource, string>>;
  firstName: string | null;
  lastName: string | null;
  email: string;
  linkblue: string | null;
  role: PlainRole;
  memberOf: PlainTeam[] | string[];
  captainOf: PlainTeam[] | string[];
}

export interface PersonResourceInitializer {
  personId: PersonResource["personId"];
  authIds: PersonResource["authIds"];
  firstName?: PersonResource["firstName"];
  lastName?: PersonResource["lastName"];
  email: PersonResource["email"];
  linkblue?: PersonResource["linkblue"];
  role: PersonResource["role"];
  memberOf?: PersonResource["memberOf"];
  captainOf?: PersonResource["captainOf"];
}

PersonResource satisfies ResourceStatic<PersonResource, PlainPerson>;
