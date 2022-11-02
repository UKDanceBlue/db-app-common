import { FirestoreImageJson } from "./FirestoreImage.js";
import { FirestoreDocumentJson } from "./internal.js";

export interface NotificationInfoPopup extends FirestoreDocumentJson {
  title: string;
  message: string;
  image?: FirestoreImageJson;
}

export interface NotificationPayload {
  url: string;
}
