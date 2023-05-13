import type { DbRole } from "../../index.js";

import type { PersonResource } from "./Person.js";
import type { PointEntryResource } from "./PointEntry.js";

export enum TeamType {
  Spirit = "Spirit",
  Morale = "Morale",
}

export class TeamResource {
  teamId!: string;

  name!: string;

  type!: TeamType;

  visibility!: DbRole;

  members!: PersonResource[] | string[];

  captains!: PersonResource[] | string[];

  pointEntries!: PointEntryResource[] | string[];
}
