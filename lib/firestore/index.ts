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

export interface FirestoreMetadata extends Record<string, AllowedFirestoreTypes> {
  schemaVersion?: number;
  createdAt?: BasicTimestamp;
  modifiedAt?: BasicTimestamp;
}
