export interface FirestoreDocumentData extends Function {
  [key: string]: any;
}

export interface FirestoreDocumentReference<T extends FirestoreDocumentData = any> extends Function {
  id: unknown;
  path: unknown;
}

export interface FirestoreTimestamp extends Function {
  nanoseconds: number;
  seconds: number;
  now(): FirestoreTimestamp;
  fromDate(date: Date): FirestoreTimestamp;
  fromMillis(milliseconds: number): FirestoreTimestamp;
  toDate(): Date;
  toMillis(): number;
}