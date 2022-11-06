import { AllowedFirestoreTypes } from "../shims/Firestore.js";
import { FirestoreImageJsonV1 } from "./FirestoreImage.js";

export interface NotificationInfoPopup extends Record<string, AllowedFirestoreTypes> {
  title: string;
  message: string;
  image?: FirestoreImageJsonV1;
}

export interface NotificationPayload extends Record<string, AllowedFirestoreTypes> {
  url: string;
}
