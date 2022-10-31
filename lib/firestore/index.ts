import { FirestoreTimestamp } from "../shims/Firestore";

export * from "./FirestoreUser";
export * from "./FirestoreImage";
export * from "./FirestoreSponsor";
export * from "./FirestoreTeam";
export * from "./FirestoreDevice";
export * from "./FirestoreEvent";

export interface FirestoreMetadata {
  schemaVersion: number;
  createdAt: FirestoreTimestamp;
  modifiedAt: FirestoreTimestamp;
}