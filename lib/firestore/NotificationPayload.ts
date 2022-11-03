import { AllowedFirestoreTypes } from "../shims/Firestore.js";
import { FirestoreImageJson } from "./FirestoreImage.js";

export interface NotificationInfoPopup extends Record<string, AllowedFirestoreTypes> {
  title: string;
  message: string;
  image?: FirestoreImageJson;
}

export interface NotificationPayload extends Record<string, AllowedFirestoreTypes> {
  url: string;
}
