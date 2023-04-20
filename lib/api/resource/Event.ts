import type { DateTime, Interval } from "luxon";

import type { ImageResource } from "./Image.js";

export interface EventResource {
  eventId: string;

  images: ImageResource[];

  start: DateTime[];

  end: DateTime[];

  intervals: Interval[];

  title: string;

  summary: string;

  description: string;

  location: string;
}
