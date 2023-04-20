import type { PersonResource } from "./Person.js";
import type { TeamResource, TeamType } from "./Team.js";

export interface PointEntryResource {
  entryId: string;

  type: TeamType;

  description: string;

  points: number;

  personFrom: PersonResource | null;

  team: TeamResource;
}
