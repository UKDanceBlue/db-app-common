import type { PersonResource } from "./Person.js";
import type { TeamResource, TeamType } from "./Team.js";

export interface PointEntryResource {
  entryId: string;

  type: TeamType;

  comment: string;

  points: number;

  personFrom: PersonResource | string | null;

  team: TeamResource | string;
}
