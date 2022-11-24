import { BasicTimestamp, AllowedFirestoreTypes } from "../shims/Firestore.js";

export * from "./FirestoreUser.js";
export * from "./FirestoreImage.js";
export * from "./FirestoreSponsor.js";
export * from "./FirestoreTeam.js";
export * from "./FirestoreDevice.js";
export * from "./FirestoreEvent.js";
export * from "./FirestoreNotification.js";
export * from "./NotificationPayload.js";
export * from "./SpiritTeamsRootDoc.js";
export * from './FirestoreSpiritOpportunityInfo.js'
export * from './FirestoreSpiritPointEntry.js'
export * from './sharedTypes'

export interface FirestoreMetadata<Version extends number = number> extends Record<string, AllowedFirestoreTypes> {
  schemaVersion?: Version;
  documentId?: string;
  documentPath?: string;
  createdAt?: BasicTimestamp;
  modifiedAt?: BasicTimestamp;
}
