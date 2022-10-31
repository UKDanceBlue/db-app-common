import { FirestoreNotification } from "./FirestoreNotification";
import { isDocumentReference } from "./firebaseTypes";
import { FirestoreDocumentData, FirestoreDocumentReference } from "../shims/Firestore";

export interface FirestoreUserJson {
  attributes: Record<string, string>;
  email: string;
  firstName: string;
  lastName: string;
  linkblue?: string | null;
  team?: FirestoreDocumentReference | null;
  notificationReferences?: FirestoreDocumentReference<FirestoreNotification>[] | null;
}

export class FirestoreUser {
  attributes: Record<string, string>;
  email: string;
  firstName: string;
  lastName: string;
  linkblue?: string = undefined;
  team?: FirestoreDocumentReference = undefined;
  notificationReferences?: FirestoreDocumentReference<FirestoreNotification>[] = undefined;

  constructor(
    attributes: FirestoreUser["attributes"],
    email: FirestoreUser["email"],
    firstName: FirestoreUser["firstName"],
    lastName: FirestoreUser["lastName"],
    linkblue?: FirestoreUser["linkblue"],
    team?: FirestoreUser["team"],
    notificationReferences?: FirestoreUser["notificationReferences"],
  ) {
    this.attributes = attributes;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;

    if (linkblue != null) {
      this.linkblue = linkblue;
    }
    if (team != null) {
      this.team = team;
    }
    if (notificationReferences != null) {
      this.notificationReferences = notificationReferences;
    }
  }

  static fromJson(json: FirestoreUserJson): FirestoreUser {
    const returnVal = new FirestoreUser(
      json.attributes,
      json.email,
      json.firstName,
      json.lastName,
    );

    if (json.linkblue != null) {
      returnVal.linkblue = json.linkblue;
    }
    if (json.team != null) {
      returnVal.team = json.team;
    }
    if (json.notificationReferences != null) {
      returnVal.notificationReferences = json.notificationReferences;
    }

    return returnVal;
  }

  toJson(): FirestoreUserJson {
    const returnVal: FirestoreUserJson = {
      attributes: this.attributes,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };

    if (this.linkblue != null) {
      returnVal.linkblue = this.linkblue;
    }
    if (this.team != null) {
      returnVal.team = this.team;
    }
    if (this.notificationReferences != null) {
      returnVal.notificationReferences = this.notificationReferences;
    }

    return returnVal;
  }

  static isUserJson(documentData?: FirestoreDocumentData): documentData is FirestoreUserJson {
    if (documentData == null) {
      return false;
    }

    // Check that all required fields are present
    if (documentData.attributes == null) {
      documentData.attributes = {};
    }
    if (documentData.email == null) {
      return false;
    }
    if (documentData.firstName == null) {
      return false;
    }
    if (documentData.lastName == null) {
      return false;
    }

    if (typeof documentData.attributes !== "object") {
      return false;
    }
    if (typeof documentData.email !== "string") {
      return false;
    }
    if (typeof documentData.firstName !== "string") {
      return false;
    }
    if (typeof documentData.lastName !== "string") {
      return false;
    }

    if (documentData.linkblue != null && typeof documentData.linkblue !== "string") {
      return false;
    }
    if (documentData.team != null && !(isDocumentReference(documentData.team))) {
      return false;
    }
    if (documentData.pastNotifications != null && (!Array.isArray(documentData.pastNotifications) || documentData.pastNotifications.some((x) => !(isDocumentReference(x))))) {
      return false;
    }

    return true;
  }
}
