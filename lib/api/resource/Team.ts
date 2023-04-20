import type { PersonResource } from "./Person.js";
import type { PointEntryResource } from "./PointEntry.js";
import type { RoleResource } from "./Role.js";

export enum TeamType {
  Spirit = "Spirit",
  Morale = "Morale",
}

export interface TeamResource {
  teamId: string;

  name: string;

  type: TeamType;

  visibility: RoleResource;

  members: PersonResource[];

  captains: PersonResource[];

  pointEntries: PointEntryResource[];
}
