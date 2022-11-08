import { FirestoreDocumentJson } from "../firestore/internal.js";

export type AllowedFirestoreTypes = { [key: string]: AllowedFirestoreTypes } | AllowedFirestoreTypes[] | BasicGeopoint | BasicTimestamp | FirestoreDocumentReference | string | number | boolean | null;

export interface FirestoreDocumentReference<T extends FirestoreDocumentJson = FirestoreDocumentJson> extends Function {
  id: unknown;
  path: unknown;
}

export interface BasicTimestamp {
  nanoseconds: number;
  seconds: number;
  toMillis(): number;
  toDate(): Date;
  valueOf(): string;
  toJSON(): { nanoseconds: number, seconds: number };
  isEqual(other: BasicTimestamp): boolean;
}

/**
 * Avoid using this unless the type is almost certainly a Timestamp.
 */
export function isTimestampLike(value: unknown): value is BasicTimestamp {
  return typeof value === "object" && value != null && "nanoseconds" in value && "seconds" in value;
}

export interface BasicGeopoint {
  latitude: number;
  longitude: number;
  toJSON(): { latitude: number, longitude: number };
  isEqual(other: BasicGeopoint): boolean;
}

/**
 * Avoid using this unless the type is almost certainly a Geopoint.
 */
export function isGeopointLike(value: unknown): value is BasicGeopoint {
  return typeof value === "object" && value != null && "latitude" in value && "longitude" in value;
}