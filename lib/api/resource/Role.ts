import type { CommitteeRole } from "../../auth/index.js";
import { DbRole } from "../../auth/index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

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
}

export interface RoleResourceInitializer {
  dbRole: RoleResource["dbRole"];
  committeeRole?: RoleResource["committeeRole"];
  committee?: RoleResource["committee"];
}
