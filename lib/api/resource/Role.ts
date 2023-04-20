import type { CommitteeRole, DbRole } from "../../auth/index.js";

export interface RoleResource {
  dbRole: DbRole;

  committeeRole: CommitteeRole | null;

  committee: string | null;
}
