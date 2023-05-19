import { DateTime, Duration } from "luxon";

import { isArrayOf } from "../../index.js";
import {
  ValidationError,
  checkType,
  checkUnion,
} from "../../util/resourceValidation.js";

import type { PlainImage } from "./Image.js";
import { ImageResource } from "./Image.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
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
    const isDateTimeArray = checkType("DateTime", this.occurrences, errors, {
      isArray: true,
    });
    if (isDateTimeArray) {
      if (this.occurrences.length === 0) {
        errors.push(new ValidationError("occurrences is empty."));
      }
      if (this.occurrences.some((o) => !o.isValid)) {
        errors.push(new ValidationError("occurrences contains invalid dates."));
      }
    }
    const isDuration = checkType("Duration", this.duration, errors, {
      allowNull: true,
    });
    if (isDuration && this.duration != null) {
      if (!this.duration.isValid) {
        errors.push(new ValidationError("duration is invalid."));
      }
      if (this.duration.as("milliseconds") < 0) {
        errors.push(new ValidationError("duration cannot be negative."));
      }
    }
    checkType("string", this.title, errors);
    checkType("string", this.summary, errors, { allowNull: true });
    checkType("string", this.description, errors, { allowNull: true });
    checkType("string", this.location, errors, { allowNull: true });
    return errors;
  }

  public toPlain(): PlainEvent {
    let images: string[] | PlainImage[] | null = null;
    if (this.images != null) {
      images = isArrayOf(this.images, "string")
        ? this.images
        : this.images.map((i) => i.toPlain());
    }

    return {
      eventId: this.eventId,
      images,
      occurrences: this.occurrences
        .map((o) => o.toISO())
        .filter((o): o is NonNullable<typeof o> => o != null),
      duration: this.duration?.toISO() ?? null,
      title: this.title,
      summary: this.summary,
      description: this.description,
      location: this.location,
    };
  }

  public static fromPlain(plain: PlainEvent): EventResource {
    let images: ImageResource[] | string[] | null = null;
    if (plain.images != null) {
      images = isArrayOf(plain.images, "string")
        ? plain.images
        : plain.images.map((i) => ImageResource.fromPlain(i));
    }

    return new EventResource({
      eventId: plain.eventId,
      images,
      occurrences: plain.occurrences.map((o) => DateTime.fromISO(o)),
      duration: plain.duration ? Duration.fromISO(plain.duration) : null,
      title: plain.title,
      summary: plain.summary,
      description: plain.description,
      location: plain.location,
    });
  }
}

export interface PlainEvent
  extends PlainResourceObject<EventResourceInitializer> {
  eventId: string;
  images: string[] | PlainImage[] | null;
  occurrences: string[];
  duration: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  location: string | null;
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

EventResource satisfies ResourceStatic<EventResource, PlainEvent>;
