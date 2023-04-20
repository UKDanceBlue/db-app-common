import type { AuthSource } from "../../auth/index.js";

import type { PointEntryResource } from "./PointEntry.js";
import type { RoleResource } from "./Role.js";
import type { TeamResource } from "./Team.js";

export interface PersonResource {
  userId: string;

  /**
   * This is usually either a random uuid, or the oid claim from the OIDC id_token, depending on the auth source
   */
  authIds: Partial<Record<AuthSource, string>>;

  firstName: string;

  lastName: string;

  email: string;

  linkblue: string;

  role: RoleResource;

  memberOf?: TeamResource[];

  captainOf?: TeamResource[];

  pointEntries?: PointEntryResource[];
}
