export interface FirestoreDocumentData {
  [key: string]: any;
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
}