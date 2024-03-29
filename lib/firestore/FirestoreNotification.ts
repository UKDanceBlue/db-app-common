import { AllowedFirestoreTypes } from "../shims/Firestore.js";
import { FirestoreDocumentJson } from ".";

export interface FirestoreNotification extends FirestoreDocumentJson {
  body: string;
  sendTime: string;
  sound?: string;
  title: string;
  payload?: AllowedFirestoreTypes;
  sentToAll?: boolean;
}

export function isFirestoreNotification(notification?: object): notification is FirestoreNotification {
  if (notification == null) {
    return false;
  }

  const {
    body, payload, sendTime, sound, title, sentToAll
  } = notification as Partial<FirestoreNotification>;

  // Check that all required fields are present and of the correct type
  if (body == null) {
    return false;
  } else if (typeof body !== "string") {
    return false;
  }

  if (sendTime == null) {
    return false;
  } else if (!(typeof sendTime === "string")) {
    return false;
  }

  if (sound != null && typeof sound !== "string") {
    return false;
  }

  if (title == null) {
    return false;
  } else if (typeof title !== "string") {
    return false;
  }

  if (payload != null && typeof payload !== "object") {
    return false;
  }

  if (sentToAll != null && typeof sentToAll !== "boolean") {
    return false;
  }

  return true;
}
