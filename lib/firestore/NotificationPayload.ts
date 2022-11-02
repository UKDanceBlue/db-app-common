import { FirestoreImage } from "./FirestoreImage.js";

export interface NotificationInfoPopup {
  title: string;
  message: string;
  image?: FirestoreImage;
}

export interface NotificationPayload {
  url: string;
}
