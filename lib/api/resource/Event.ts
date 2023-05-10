import type { DateTime, Duration } from "luxon";

import type { ImageResource } from "./Image.js";

export interface EventResource {
  eventId: string;

  images: ImageResource[] | string[];

  occurrences: DateTime[];

  duration: Duration | null;

  title: string;

  summary: string | null;

  description: string | null;

  location: string | null;
}
