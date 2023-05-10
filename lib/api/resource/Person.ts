import type { AuthSource } from "../../auth/index.js";

import type { PointEntryResource } from "./PointEntry.js";
import type { RoleResource } from "./Role.js";
import type { TeamResource } from "./Team.js";

export interface PersonResource {
  userId: string;

  authIds: Partial<Record<AuthSource, string>>;

  firstName: string | null;

  lastName: string | null;

  email: string;

  linkblue: string | null;

  role: RoleResource;

  memberOf: TeamResource[] | string[];

  captainOf: TeamResource[] | string[];

  pointEntries: PointEntryResource[] | string[];
}
