import { BasicTimestamp } from "../shims/Firestore.js";

export * from "./FirestoreUser.js";
export * from "./FirestoreImage.js";
export * from "./FirestoreSponsor.js";
export * from "./FirestoreTeam.js";
export * from "./FirestoreDevice.js";
export * from "./FirestoreEvent.js";
export * from "./FirestoreNotification.js";
export * from "./NotificationPayload.js";
export * from "./SpiritTeamsRootDoc.js";

export interface FirestoreMetadata {
  schemaVersion?: number;
  createdAt?: BasicTimestamp;
  modifiedAt?: BasicTimestamp;
}
