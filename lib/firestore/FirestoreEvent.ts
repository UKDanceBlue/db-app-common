import { FirestoreImageJson, FirestoreImage } from "./index.js";
import { FromJson, hasFirestoreMetadata, IsValidJson, MaybeWithFirestoreMetadata, WhatIsWrongWithThisJson } from "./internal.js";
import { BasicTimestamp } from "../shims/Firestore.js";
import { FormErrors } from "../util/formReducer.js";
import { RecursivePartial } from "../util/index.js";

export interface FirestoreEventInterval {
  start: BasicTimestamp;
  end: BasicTimestamp;
}

export interface FirestoreEventLink {
  text: string;
  url: string;
}

export interface FirestoreEventJson {
  name: string;
  shortDescription: string;
  description: string;
  interval?: FirestoreEventInterval;
  intervals?: FirestoreEventInterval[];
  address?: string;
  images?: FirestoreImageJson[];
  highlightedLinks?: FirestoreEventLink[];
}

export class FirestoreEvent {
  private createdAt?: BasicTimestamp;
  private modifiedAt?: BasicTimestamp;
  name: string;
  shortDescription: string;
  description: string;
  interval?: FirestoreEventInterval;
  private specificIntervals?: FirestoreEventInterval[];
  address?: string;
  images?: FirestoreImage[];
  highlightedLinks?: FirestoreEventLink[];

  constructor(
    name: string,
    shortDescription: string,
    description: string,
    interval?: FirestoreEventInterval,
    intervals?: FirestoreEventInterval[],
    address?: string,
    images?: FirestoreImage[],
    highlightedLinks?: FirestoreEventLink[]
  ) {
    this.name = name;
    this.shortDescription = shortDescription;
    this.description = description;
    this.interval = interval;
    this.specificIntervals = intervals;
    this.address = address;
    this.images = images;
    this.highlightedLinks = highlightedLinks;
  }

  static fromJson: FromJson<FirestoreEventJson, FirestoreEvent> = (json) => {
    const schemaVersion = hasFirestoreMetadata(json) ? json.__meta.schemaVersion ?? 0 : 0;

    switch (schemaVersion) {
      case 0: {
        interface LegacyEventType {
          title: string;
          shortDescription?: string;
          description: string;
          image?: {
            uri: `gs://${string}` | `http${"s" | ""}://${string}`;
            width: number;
            height: number;
          } | {
            uri: `gs://${string}` | `http${"s" | ""}://${string}`;
            width: number;
            height: number;
          }[];
          address?: string;
          startTime?: BasicTimestamp;
          endTime?: BasicTimestamp;
          link?: {
            text: string;
            url: string;
          } | {
            text: string;
            url: string;
          }[];
        }

        const {
          title,
          shortDescription,
          description,
          image,
          address,
          startTime,
          endTime,
          link,
        } = json as unknown as LegacyEventType;

        if (startTime == null || endTime == null) {
          alert(JSON.stringify(json));
          throw new Error("Event must have a start and end time");
        }

        let images: FirestoreImage[] | undefined;

        if (image) {
          if (Array.isArray(image)) {
            images = image.map(FirestoreImage.fromJson);
          } else {
            images = [FirestoreImage.fromJson(image)];
          }
        }

        return new FirestoreEvent(
          title,
          shortDescription ?? "",
          description,
          {
            start: startTime,
            end: endTime,
          },
          undefined,
          address,
          images,
          link ? Array.isArray(link) ? link : [link] : undefined
        );
      }
      case 1: {
        const returnVal = new FirestoreEvent(
          json.name,
          json.shortDescription,
          json.description,
          json.interval,
          json.intervals,
          json.address,
          json.images?.map(FirestoreImage.fromJson),
          json.highlightedLinks
        );

        if (hasFirestoreMetadata(json)) {
          returnVal.createdAt = json.__meta.createdAt;
          returnVal.modifiedAt = json.__meta.modifiedAt;
        }

        return returnVal;
      }
      default: {
        throw new Error(`Unknown schema version: ${schemaVersion}`);
      }
    }
  }

  toJson(): MaybeWithFirestoreMetadata<FirestoreEventJson> {
    return {
      __meta: {
        schemaVersion: 1,
      },
      name: this.name,
      shortDescription: this.shortDescription,
      description: this.description,
      interval: this.interval,
      intervals: this.intervals,
      address: this.address,
      images: this.images?.map((image) => image.toJson()),
      highlightedLinks: this.highlightedLinks,
    };
  }

  static whatIsWrongWithThisJson: WhatIsWrongWithThisJson<FirestoreEventJson> = (json) => {
    const schemaVersion = hasFirestoreMetadata(json) ? json.__meta.schemaVersion ?? 0 : 0;

    let isSomethingWrong = false;
    const errors: FormErrors<FirestoreEventJson> = {};

    switch (schemaVersion) {
      case 0: {
        console.warn("Legacy schema version detected for FirestoreEvent, no validation will be performed");
        break;
      }
      case 1: {
        if (json == null) {
          isSomethingWrong = true;
          errors["%STRUCTURE%"] = "Event is null";
        }

        if (typeof json !== "object") {
          isSomethingWrong = true;
          errors["%STRUCTURE%"] = "Event is not an object";
        }

        const { name, shortDescription, description, interval, intervals, address, images, highlightedLinks } = json as RecursivePartial<FirestoreEventJson>;

        if (typeof name !== "string") {
          isSomethingWrong = true;
          errors.name = "Name must be a string";
        }

        if (typeof shortDescription !== "string") {
          isSomethingWrong = true;
          errors.shortDescription = "Short description must be a string";
        }

        if (typeof description !== "string") {
          isSomethingWrong = true;
          errors.description = "Description must be a string";
        }

        if (interval != null) {
          if (typeof interval !== "object") {
            isSomethingWrong = true;
            errors.interval = "Interval must be an object";
          } else {
            const { start, end } = interval as RecursivePartial<FirestoreEventInterval>;

            if (typeof start !== "object") {
              isSomethingWrong = true;
              errors.interval = "Interval must be an object";
            } else {
              const { seconds, nanoseconds } = start as RecursivePartial<BasicTimestamp>;

              if (typeof seconds !== "number") {
                isSomethingWrong = true;
                errors.interval = "Interval must be an object";
              }

              if (typeof nanoseconds !== "number") {
                isSomethingWrong = true;
                errors.interval = "Interval must be an object";
              }
            }

            if (typeof end !== "object") {
              isSomethingWrong = true;
              errors.interval = "Interval must be an object";
            } else {
              const { seconds, nanoseconds } = end as RecursivePartial<BasicTimestamp>;

              if (typeof seconds !== "number") {
                isSomethingWrong = true;
                errors.interval = "Interval must be an object";
              }

              if (typeof nanoseconds !== "number") {
                isSomethingWrong = true;
                errors.interval = "Interval must be an object";
              }
            }
          }
        }

        if (intervals != null) {
          if (!Array.isArray(intervals)) {
            isSomethingWrong = true;
            errors.intervals = "Intervals must be an array";
          }
        }

        if (address != null) {
          if (typeof address !== "string") {
            isSomethingWrong = true;
            errors.address = "Address must be a string";
          }
        }

        if (images != null) {
          if (!Array.isArray(images)) {
            isSomethingWrong = true;
            errors.images = "Images must be an array";
          }
        }

        if (highlightedLinks != null) {
          if (!Array.isArray(highlightedLinks)) {
            isSomethingWrong = true;
            errors.highlightedLinks = "Highlighted links must be an array";
          }
        }

        break;
      }
      default: {
        throw new Error(`Unknown schema version: ${schemaVersion}`);
      }
    }

    return isSomethingWrong ? errors : null;
  }

  static isValidJson: IsValidJson<FirestoreEventJson> = (json): json is FirestoreEventJson => {
    return !FirestoreEvent.whatIsWrongWithThisJson(json);
  }

  get createdAtDate(): BasicTimestamp | undefined {
    return this.createdAt;
  }

  get modifiedAtDate(): BasicTimestamp | undefined {
    return this.modifiedAt;
  }

  get intervals(): FirestoreEventInterval[] {
    if (this.specificIntervals) {
      return this.specificIntervals;
    } else if (this.interval) {
      return [this.interval];
    } else {
      return [];
    }
  }

  set intervals(intervals: FirestoreEventInterval[]) {
    this.specificIntervals = intervals;
  }
}
