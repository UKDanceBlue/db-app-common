import type { CommitteeRole } from "../../auth/index.js";
import { DbRole } from "../../auth/index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";
export class RoleResource extends Resource {
  dbRole!: DbRole;

  committeeRole!: CommitteeRole | null;

  committee!: string | null;

  constructor({ dbRole, committeeRole, committee }: RoleResourceInitializer) {
    super();
    this.dbRole = dbRole;
    this.committeeRole = committeeRole ?? null;
    this.committee = committee ?? null;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("Enum", this.dbRole, errors, {
      enumToCheck: DbRole,
    });
    checkType("string", this.committeeRole, errors, { allowNull: true });
    checkType("string", this.committee, errors, { allowNull: true });
    return errors;
  }

  public toPlain(): PlainRole {
    return {
      dbRole: this.dbRole,
      committeeRole: this.committeeRole,
      committee: this.committee,
    };
  }

  public static fromPlain(plain: PlainRole): RoleResource {
    return new RoleResource({
      dbRole: plain.dbRole,
      committeeRole: plain.committeeRole,
      committee: plain.committee,
    });
  }

  static graphqlType = `#graphql
    enum DbRole {
      none
      public
      team_member
      team_captain
      committee
    }
    enum CommitteeRole {
      chair
      coordinator
      member
    }
    type Role {
      dbRole: DbRole!
      committeeRole: CommitteeRole
      committee: String
    }
  `;
}

export interface PlainRole
  extends PlainResourceObject<RoleResourceInitializer> {
  dbRole: DbRole;
  committeeRole: CommitteeRole | null;
  committee: string | null;
}

export interface RoleResourceInitializer {
  dbRole: RoleResource["dbRole"];
  committeeRole?: RoleResource["committeeRole"];
  committee?: RoleResource["committee"];
}

RoleResource satisfies ResourceStatic<RoleResource, PlainRole>;
