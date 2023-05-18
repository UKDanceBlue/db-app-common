import { Type } from "class-transformer";
import type { DateTime, Duration } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import { ImageResource } from "./Image.js";
import type { ResourceConstructor } from "./Resource.js";
import { Resource } from "./Resource.js";

export class EventResource extends Resource {
  eventId!: string;

  images!: ImageResource[] | string[] | null;

  occurrences!: DateTime[];

  duration!: Duration | null;

  title!: string;

  summary!: string | null;

  description!: string | null;

  location!: string | null;

  constructor({
    eventId,
    images,
    occurrences,
    duration,
    title,
    summary,
    description,
    location,
  }: EventResourceInitializer) {
    super();
    this.eventId = eventId;
    this.images = images ?? null;
    this.occurrences = occurrences;
    this.duration = duration ?? null;
    this.title = title;
    this.summary = summary ?? null;
    this.description = description ?? null;
    this.location = location ?? null;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.eventId, errors);
    checkUnion(
      [
        {
          type: "Resource",
          options: {
            classToCheck: ImageResource,
            isArray: true,
          },
        },
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
      ],
      this.images,
      errors,
      { allowNull: true }
    );
    checkType("DateTime", this.occurrences, errors, { isArray: true });
    checkType("Duration", this.duration, errors, { allowNull: true });
    checkType("string", this.title, errors);
    checkType("string", this.summary, errors, { allowNull: true });
    checkType("string", this.description, errors, { allowNull: true });
    checkType("string", this.location, errors, { allowNull: true });
    return errors;
  }
}

export interface EventResourceInitializer {
  eventId: EventResource["eventId"];
  images?: EventResource["images"];
  occurrences: EventResource["occurrences"];
  duration?: EventResource["duration"];
  title: EventResource["title"];
  summary?: EventResource["summary"];
  description?: EventResource["description"];
  location?: EventResource["location"];
}

EventResource satisfies ResourceConstructor<EventResource>;
