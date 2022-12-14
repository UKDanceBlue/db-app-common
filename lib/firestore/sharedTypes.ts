import { AllowedFirestoreTypes, FirestoreDocumentSnapshot } from "../shims/Firestore.js";
import { FormErrors } from "../util/formReducer.js";
import { FirestoreMetadata } from ".";

export interface FirestoreDocumentJson { }
export interface FirestoreDocumentModelInstance<T extends FirestoreDocumentJson> {
  documentMetadata?: FirestoreMetadata,
  toJson(): T;
}

export type WithFirestoreMetadata<T, Version extends number = number> = T & { __meta: FirestoreMetadata<Version>; };
export type MaybeWithFirestoreMetadata<T> = T | WithFirestoreMetadata<T>;
export function hasFirestoreMetadata<T>(doc: MaybeWithFirestoreMetadata<T>): doc is WithFirestoreMetadata<T> {
  return (doc as WithFirestoreMetadata<T>).__meta != null;
}
export function lacksFirestoreMetadata<T>(doc: MaybeWithFirestoreMetadata<T>): doc is T {
  return (doc as WithFirestoreMetadata<T>).__meta == null;
}
export function removeFirestoreMetadata<T>(doc: WithFirestoreMetadata<T>): T {
  const temp: {
    [key: string]: unknown;
    __meta?: FirestoreMetadata;
  } = { ...doc };
  delete temp.__meta;
  return temp as T;
}

export type FromSnapshot<T extends MaybeWithFirestoreMetadata<FirestoreDocumentJson>, R extends FirestoreDocumentModelInstance<T>> = (snapshot: FirestoreDocumentSnapshot<MaybeWithFirestoreMetadata<T>>) => R
export type FromJson<T extends MaybeWithFirestoreMetadata<FirestoreDocumentJson>, R extends FirestoreDocumentModelInstance<T>> = (json: T, additionalOptions?: {schemaVersion?: number, documentId?: string}) => R;
export type WhatIsWrongWithThisJson<T extends MaybeWithFirestoreMetadata<FirestoreDocumentJson>> = (json?: unknown | T) => FormErrors<T> | null;
export type IsValidJson<T extends MaybeWithFirestoreMetadata<FirestoreDocumentJson>> = (json?: unknown) => json is T;
export interface FirestoreDocumentModel<T extends FirestoreDocumentJson, R extends FirestoreDocumentModelInstance<T>> {
  fromSnapshot: FromSnapshot<T,R>;
  fromJson: FromJson<T, R>;
  whatIsWrongWithThisJson?: WhatIsWrongWithThisJson<T>;
  isValidJson: IsValidJson<T>;
}
