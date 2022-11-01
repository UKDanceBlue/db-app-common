import { Constructor } from "../util/Class";

export interface FirestoreDocumentData {
  [key: string]: any;
}

export interface FirestoreDocumentReference<T extends FirestoreDocumentData = any> extends Function {
  id: unknown;
  path: unknown;
}

interface BaseTimestamp {
  nanoseconds: number;
  seconds: number;
}

export type FirestoreTimestamp = Constructor<BaseTimestamp>;