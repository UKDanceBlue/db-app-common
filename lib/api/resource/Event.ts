import type { Interval } from "luxon";

import type { ImageResource } from "./Image.js";

export interface EventResource {
  eventId: string;

  images: ImageResource[];

  occurrences: Interval[];

  title: string;

  summary: string | null;

  description: string | null;

  location: string | null;
}
