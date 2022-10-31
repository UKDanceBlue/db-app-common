import { FirestoreMetadata, FirestoreImageJson } from ".";
import { FirestoreTimestamp } from "../shims/Firestore";

export interface FirestoreEventInterval {
  start: FirestoreTimestamp;
  end: FirestoreTimestamp;
}

export interface FirestoreEventLink {
  text: string;
  url: string;
}

export interface FirestoreEventJson {
  __meta?: FirestoreMetadata;
  name: string;
  shortDescription: string;
  description: string;
  interval: FirestoreEventInterval;
  intervals?: FirestoreEventInterval[];
  address?: string;
  images?: FirestoreImageJson[];
  highlightedLinks?: FirestoreEventLink[];
}

export class FirestoreEvent {
  private createdAt?: FirestoreTimestamp;
  private modifiedAt?: FirestoreTimestamp;
  name: string;
  shortDescription: string;
  description: string;
  interval: FirestoreEventInterval;
  intervals?: FirestoreEventInterval[];
  address?: string;
  images?: FirestoreImageJson[];
  highlightedLinks?: FirestoreEventLink[];

  constructor(
    name: string,
    shortDescription: string,
    description: string,
    interval: FirestoreEventInterval,
    intervals?: FirestoreEventInterval[],
    address?: string,
    images?: FirestoreImageJson[],
    highlightedLinks?: FirestoreEventLink[]
  ) {
    this.name = name;
    this.shortDescription = shortDescription;
    this.description = description;
    this.interval = interval;
    this.intervals = intervals;
    this.address = address;
    this.images = images;
    this.highlightedLinks = highlightedLinks;
  }

  static fromJson(json: FirestoreEventJson): FirestoreEvent {
    const schemaVersion = json.__meta?.schemaVersion ?? 0;

    switch (schemaVersion) {
      case 0: {
        interface V1Event {
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
          startTime?: FirestoreTimestamp;
          endTime?: FirestoreTimestamp;
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
        } = json as unknown as V1Event;

        if (!startTime || !endTime) {
          throw new Error("Event must have a start and end time");
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
          image ? Array.isArray(image) ? image : [image] : undefined,
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
          json.images,
          json.highlightedLinks
        );

        if (json.__meta != null) {
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

  toJson(now: FirestoreTimestamp): FirestoreEventJson {
    return {
      name: this.name,
      shortDescription: this.shortDescription,
      description: this.description,
      interval: this.interval,
      intervals: this.intervals,
      address: this.address,
      images: this.images,
      highlightedLinks: this.highlightedLinks,
    };
  }

  // Like the method for FirestoreUser.ts
  static isEventJson(json: unknown): json is FirestoreEventJson {
    if (typeof json !== "object" || json === null) {
      return false;
    }

    const {
      __meta,
      name,
      shortDescription,
      description,
      interval,
      intervals,
      address,
      images,
      highlightedLinks,
    } = json as unknown as FirestoreEventJson;

    if (!name || typeof name !== "string") {
      return false;
    }

    if (!shortDescription || typeof shortDescription !== "string") {
      return false;
    }

    if (!description || typeof description !== "string") {
      return false;
    }

    if (!interval || typeof interval !== "object" || interval === null) {
      return false;
    }

    const { start, end } = interval;

    if (!start || typeof start !== "object" || start === null) {
      return false;
    }

    if (!end || typeof end !== "object" || end === null) {
      return false;
    }

    if (intervals && !Array.isArray(intervals)) {
      return false;
    }

    if (address && typeof address !== "string") {
      return false;
    }

    if (images && !Array.isArray(images)) {
      return false;
    }

    if (highlightedLinks && !Array.isArray(highlightedLinks)) {
      return false;
    }

    return true;
  }

  get createdAtDate(): FirestoreTimestamp | undefined {
    return this.createdAt;
  }

  get modifiedAtDate(): FirestoreTimestamp | undefined {
    return this.modifiedAt;
  }
}
