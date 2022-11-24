import { FirestoreImageJsonV1, FirestoreImage, FirestoreMetadata } from "./index.js";
import { FirestoreDocumentJson, FromJson, hasFirestoreMetadata, IsValidJson, WithFirestoreMetadata, WhatIsWrongWithThisJson, FromSnapshot, MaybeWithFirestoreMetadata } from "./internal.js";
import { BasicTimestamp, AllowedFirestoreTypes, isTimestampLike } from "../shims/Firestore.js";
import { FormErrors } from "../util/formReducer.js";
import { RecursivePartial } from "../util/index.js";

export interface FirestoreEventInterval extends Record<string, AllowedFirestoreTypes>{
  start: BasicTimestamp;
  end: BasicTimestamp;
}
function isFirestoreEventIntervalLike(json: unknown): json is FirestoreEventInterval {
  if (json == null) {
    return false;
  }

  const {
    start, end
  } = json as Partial<FirestoreEventInterval>;

  if (start == null || !isTimestampLike(start)) {
    return false;
  }

  if (end == null || !isTimestampLike(end)) {
    return false;
  }

  return true;
}

export interface FirestoreEventLink extends Record<string, AllowedFirestoreTypes> {
  text: string;
  url: string;
}
function isFirestoreEventLink(json: unknown): json is FirestoreEventLink {
  if (json == null) {
    return false;
  }

  const {
    text, url
  } = json as Partial<FirestoreEventLink>;

  if (text == null || typeof text !== "string") {
    return false;
  }

  if (url == null || typeof url !== "string") {
    return false;
  }
  
  return true;
}

export interface FirestoreEventJsonV0 extends FirestoreDocumentJson {
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

export interface FirestoreEventJsonV1 extends FirestoreDocumentJson {
  name: string;
  shortDescription: string;
  description: string;
  interval?: FirestoreEventInterval;
  intervals?: FirestoreEventInterval[];
  address?: string;
  images?: FirestoreImageJsonV1[];
  highlightedLinks?: FirestoreEventLink[];
}

export interface FirestoreEventJson extends FirestoreEventJsonV1 {};
export type UnVersionedFirestoreEventJson = FirestoreEventJsonV0 | FirestoreEventJsonV1;

export class FirestoreEvent {
  documentMetadata?: FirestoreMetadata;
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

    if (intervals) {
      this.specificIntervals = intervals;
    }
    if (interval) {
      this.interval = interval;
    }
    if (address) {
      this.address = address;
    }
    if (images) {
      this.images = images;
    }
    if (highlightedLinks) {
      this.highlightedLinks = highlightedLinks;
    }
  }

  static fromSnapshot: FromSnapshot<UnVersionedFirestoreEventJson, FirestoreEvent> = (snapshot) => {
    const json = snapshot.data() as MaybeWithFirestoreMetadata<unknown>
    
    if (hasFirestoreMetadata(json) && json.__meta.schemaVersion != null) {
      if (FirestoreEvent.isValidJson(json)) {
        return FirestoreEvent.fromJson(json, {documentId: snapshot.id, schemaVersion: json.__meta.schemaVersion});
      } else {
        throw new Error("Unknown schema version for FirestoreEvent");
      }
    } else {
      // Try the default version
      if (FirestoreEvent.isValidJson(json)) {
        return FirestoreEvent.fromJson(json, {documentId: snapshot.id});
      } else {
        throw new Error("No schemaVersion found in document metadata and ");
      }
    }
  }

  static fromJson: FromJson<FirestoreEventJsonV0 | FirestoreEventJsonV1, FirestoreEvent> = (json, additionalOptions) => {
    const {schemaVersion: forceSchemaVersion, documentId} = additionalOptions ?? {};
    const schemaVersion = forceSchemaVersion ?? (hasFirestoreMetadata(json) ? json.__meta.schemaVersion ?? 0 : 0);

    switch (schemaVersion) {
      case 0: {
        throw new Error("Schema version 0 is no longer supported")
      }
      case 1: {
        const returnVal = new FirestoreEvent(
          (json as FirestoreEventJsonV1).name,
          (json as FirestoreEventJsonV1).shortDescription,
          (json as FirestoreEventJsonV1).description,
          (json as FirestoreEventJsonV1).interval,
          (json as FirestoreEventJsonV1).intervals,
          (json as FirestoreEventJsonV1).address,
          (json as FirestoreEventJsonV1).images?.map((image) => FirestoreImage.fromJson(image)),
          (json as FirestoreEventJsonV1).highlightedLinks
        );

        if (hasFirestoreMetadata(json)) {
          returnVal.documentMetadata = json.__meta;
          if (documentId != null) {
            returnVal.documentMetadata.documentId = documentId;
          }
        } else if (documentId != null) {
          returnVal.documentMetadata = {
            documentId,
            schemaVersion: 1
          };
        }

        return returnVal;
      }
      default: {
        throw new Error(`Unknown schema version: ${schemaVersion}`);
      }
    }
  }

  toJson(): WithFirestoreMetadata<FirestoreEventJsonV1, 1> {
    const returnVal: WithFirestoreMetadata<FirestoreEventJsonV1, 1> = {
      __meta: {
        ...(this.documentMetadata ?? {}),
        schemaVersion: 1,
      },
      name: this.name,
      shortDescription: this.shortDescription,
      description: this.description,
    };

    if (this.interval) {
      returnVal.interval = this.interval;
    }
    if (this.specificIntervals) {
      returnVal.intervals = this.specificIntervals;
    }
    if (this.address) {
      returnVal.address = this.address;
    }
    if (this.images) {
      returnVal.images = this.images.map(image => image.toJson());
    }
    if (this.highlightedLinks) {
      returnVal.highlightedLinks = this.highlightedLinks;
    }

    return returnVal;
  }

  static whatIsWrongWithThisJson: WhatIsWrongWithThisJson<FirestoreEventJson> = (json) => {
    const schemaVersion = hasFirestoreMetadata(json) ? json.__meta.schemaVersion ?? 1 : 1;

    let isSomethingWrong = false;
    const errors: FormErrors<FirestoreEventJson> = {};

    switch (schemaVersion) {
      case 0: {
        throw new Error("Schema version 0 is no longer supported");
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

  static isValidJson: IsValidJson<FirestoreEventJsonV1> = (json): json is FirestoreEventJsonV1 => {
    if (json == null) {
      return false;
    }

    if (typeof json !== "object") {
      return false;
    }

    const { name, shortDescription, description, interval, intervals, address, images, highlightedLinks } = json as RecursivePartial<FirestoreEventJsonV1>;

    if (typeof name !== "string") {
      return false;
    }

    if (typeof shortDescription !== "string") {
      return false;
    }

    if (typeof description !== "string") {
      return false;
    }

    if (interval != null && !isFirestoreEventIntervalLike(interval)) {
      return false;
    }
     
    if (intervals != null && !Array.isArray(intervals)) {
      return false;
    }

    if (address != null && typeof address !== "string") {
      return false;
    }

    if (images != null && !Array.isArray(images)) {
      return false;
    }

    if (highlightedLinks != null && !Array.isArray(highlightedLinks)) {
      return false;
    }

    return true;
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
