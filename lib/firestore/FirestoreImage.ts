import { AllowedFirestoreTypes } from "../shims/Firestore.js";
import { FromJson, FirestoreDocumentModelInstance, IsValidJson } from ".";

export interface FirestoreImageJsonV1 extends Record<string, AllowedFirestoreTypes> {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;
}

export class FirestoreImage implements FirestoreDocumentModelInstance<FirestoreImageJsonV1> {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;

  constructor(uri: FirestoreImage["uri"], width: FirestoreImage["width"], height: FirestoreImage["height"]) {
    this.uri = uri;
    this.width = width;
    this.height = height;
  }

  toJson(): FirestoreImageJsonV1 {
    return {
      uri: this.uri,
      width: this.width,
      height: this.height,
    };
  }

  static fromJson: FromJson<FirestoreImageJsonV1, FirestoreImage> = (json): FirestoreImage => {
    return new FirestoreImage(json.uri, json.width, json.height);
  }

  static isValidJson: IsValidJson<FirestoreImageJsonV1> = (image): image is FirestoreImageJsonV1 => {
    if (image == null) {
      return false;
    }

    const {
      uri, width, height
    } = image as Partial<FirestoreImage>;
    if (uri == null) {
      return false;
    } else if (typeof uri !== "string") {
      return false;
    } else {
      const [protocol] = uri.split("://");

      if (protocol !== "gs" && protocol !== "http" && protocol !== "https") {
        return false;
      }
    }

    if (width == null) {
      return false;
    } else if (typeof width !== "number") {
      return false;
    } else if (width < 0) {
      return false;
    }

    if (height == null) {
      return false;
    } else if (typeof height !== "number") {
      return false;
    } else if (height < 0) {
      return false;
    }

    return true;
  }
};


export interface DownloadableImageJson extends Record<string, AllowedFirestoreTypes> {
  url?: string;
  width: number;
  height: number;
}

export class DownloadableImage {
  url?: string;
  width: number;
  height: number;

  constructor(url: DownloadableImage["url"], width: DownloadableImage["width"], height: DownloadableImage["height"]) {
    if (url != null) {
      this.url = url;
    }
    this.width = width;
    this.height = height;
  }

  static async fromFirestoreImage(firestoreImage: FirestoreImage, getDownloadUrl: (uri: string) => Promise<string>): Promise<DownloadableImage> {
    const url = await getDownloadUrl(firestoreImage.uri);
    return new DownloadableImage(url, firestoreImage.width, firestoreImage.height);
  };

  toJson(): DownloadableImageJson {
    const returnVal: DownloadableImageJson = {
      width: this.width,
      height: this.height,
    };

    if (this.url != null) {
      returnVal.url = this.url;
    }

    return returnVal;
  }

  static fromJson: FromJson<DownloadableImageJson, DownloadableImage> = (json) => {
    return new DownloadableImage(json.url, json.width, json.height);
  }

  static isValidJson: IsValidJson<DownloadableImageJson> = (image): image is DownloadableImageJson => {
    if (image == null) {
      return false;
    }

    const {
      url, width, height
    } = image as Partial<DownloadableImage>;
    if (url != null && typeof url !== "string") {
      return false;
    }

    if (width == null) {
      return false;
    } else if (typeof width !== "number") {
      return false;
    } else if (width < 0) {
      return false;
    }

    if (height == null) {
      return false;
    } else if (typeof height !== "number") {
      return false;
    } else if (height < 0) {
      return false;
    }

    return true;
  }
};
