import { FirestoreDocumentJson } from ".";

export interface FirestoreDeviceJson extends FirestoreDocumentJson {
  audiences?: string[] | null;
  expoPushToken?: string | null;
  latestUserId?: string | null;
}

export class FirestoreDevice {
  audiences?: string[] = undefined;
  expoPushToken?: string = undefined;
  latestUserId?: string = undefined;

  constructor(
    audiences?: FirestoreDeviceJson["audiences"],
    expoPushToken?: FirestoreDeviceJson["expoPushToken"],
    latestUserId?: FirestoreDeviceJson["latestUserId"],
  ) {
    if (audiences != null) {
      this.audiences = audiences;
    }
    if (expoPushToken != null) {
      this.expoPushToken = expoPushToken;
    }
    if (latestUserId != null) {
      this.latestUserId = latestUserId;
    }
  }

  static fromJson(json: FirestoreDeviceJson): FirestoreDevice {
    return new FirestoreDevice(
      json.audiences,
      json.expoPushToken,
      json.latestUserId,
    );
  }

  toJson(): FirestoreDeviceJson {
    const returnVal: FirestoreDeviceJson = {};

    if (this.audiences != null) {
      returnVal.audiences = this.audiences;
    }
    if (this.expoPushToken != null) {
      returnVal.expoPushToken = this.expoPushToken;
    }
    if (this.latestUserId != null) {
      returnVal.latestUserId = this.latestUserId;
    }

    return returnVal;
  }

  isFirestoreDevice(documentData?: object): documentData is FirestoreDeviceJson {
    // If documentData is nullish, return false
    if (documentData == null) {
      return false;
    }

    // If audience is defined, check it's type
    const { audiences } = documentData as Partial<FirestoreDeviceJson>;
    if (audiences != null) {
      // If it's not an array, return false
      if (!Array.isArray(audiences)) {
        return false;
      }

      // If it's an array, check that all elements are strings, if not return false
      if (audiences.some((x) => typeof x !== "string")) {
        return false;
      }
    }

    // If expoPushToken is defined, check that it's a string, if not return false
    const { expoPushToken } = documentData as FirestoreDeviceJson;
    if (expoPushToken != null && typeof expoPushToken !== "string") {
      return false;
    }

    // If latestUserId is defined, check that it's a string, if not return false
    const { latestUserId } = documentData as FirestoreDeviceJson;
    if (latestUserId != null && typeof latestUserId !== "string") {
      return false;
    }

    // If all checks pass, return true
    return true;
  }
}