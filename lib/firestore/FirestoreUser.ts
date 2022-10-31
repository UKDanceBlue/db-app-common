import { FirestoreNotification } from "./FirestoreNotification";
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

  static isUserJson(documentData: unknown, documentReference: Function): documentData is FirestoreUserJson {
    if (documentData == null) {
      return false;
    }

    const {
      attributes, email, firstName, lastName, linkblue, team, notificationReferences
    } = documentData as Partial<FirestoreUserJson>;

    if (attributes == null || typeof attributes !== "object") {
      return false;
    }
    if (email == null || typeof email !== "string") {
      return false;
    }
    if (firstName == null || typeof firstName !== "string") {
      return false;
    }
    if (lastName == null || typeof lastName !== "string") {
      return false;
    }
    if (linkblue != null && typeof linkblue !== "string") {
      return false;
    }
    if (team != null && !(team instanceof documentReference)) {
      return false;
    }
    if (notificationReferences != null && (!Array.isArray(notificationReferences) || notificationReferences.some((x) => !(x instanceof documentReference)))) {
      return false;
    }

    return true;
  }
}
