import type { DateTime } from "luxon";

import type { PersonResource } from "./Person.js";
import type { TeamResource, TeamType } from "./Team.js";

export interface PointOpportunityResource {
  entryId: string;

  type: TeamType;

  name: string;

  opportunityDate: DateTime | null;

  personFrom: PersonResource | null;

  team: TeamResource;
}
