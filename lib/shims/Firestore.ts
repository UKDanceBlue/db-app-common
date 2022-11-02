export type AllowedFirestoreTypes = { [key: string]: AllowedFirestoreTypes } | AllowedFirestoreTypes[] | BasicGeopoint | BasicTimestamp | FirestoreDocumentReference | string | number | boolean | null;

export interface FirestoreDocumentData {
  [key: string]: AllowedFirestoreTypes;
}

export interface FirestoreDocumentReference<T extends FirestoreDocumentData = any> extends Function {
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

export interface BasicGeopoint {
  latitude: number;
  longitude: number;
  toJSON(): { latitude: number, longitude: number };
  isEqual(other: BasicGeopoint): boolean;
}