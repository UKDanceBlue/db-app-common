import { FirestoreImageJson } from "./FirestoreImage.js";

export interface NotificationInfoPopup {
  title: string;
  message: string;
  image?: FirestoreImageJson;
}

export interface NotificationPayload {
  url: string;
}
