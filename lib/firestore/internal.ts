import { FirestoreDocumentData } from "../shims/Firestore";
import { FirestoreMetadata } from "./index";

export interface FirestoreDocumentJson extends FirestoreDocumentData { }
export interface FirestoreDocumentModelInstance<T extends FirestoreDocumentJson> {
  toJson(): T;
}

export type WithFirestoreMetadata<T> = T & { __meta: FirestoreMetadata; };
export type WithoutFirestoreMetadata<T> = (Omit<WithFirestoreMetadata<T>, "__meta"> & { __meta?: never; });
export type MaybeWithFirestoreMetadata<T> = WithoutFirestoreMetadata<T> | WithFirestoreMetadata<T>;
export function hasFirestoreMetadata<T>(doc: MaybeWithFirestoreMetadata<T>): doc is WithFirestoreMetadata<T> {
  return doc.__meta != null;
}
export function lacksFirestoreMetadata<T>(doc: MaybeWithFirestoreMetadata<T>): doc is WithoutFirestoreMetadata<T> {
  return doc.__meta == null;
}
export function removeFirestoreMetadata<T>(doc: WithFirestoreMetadata<T>): WithoutFirestoreMetadata<T> {
  const temp: {
    [key: string]: unknown;
    __meta?: FirestoreMetadata;
  } = { ...doc };
  delete temp.__meta;
  return temp as WithoutFirestoreMetadata<T>;
}

export type FromJson<T extends FirestoreDocumentJson> = (json: MaybeWithFirestoreMetadata<T>) => FirestoreDocumentModelInstance<T>;
export type IsValidJson<T extends FirestoreDocumentJson> = (json?: unknown) => json is T;
export interface FirestoreDocumentModel<T extends FirestoreDocumentJson> {
  fromJson: FromJson<T>;
  isValidJson: IsValidJson<T>;
}
