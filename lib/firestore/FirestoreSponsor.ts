import { AllowedFirestoreTypes } from "../shims/Firestore.js";
import { DownloadableImage, DownloadableImageJson, FirestoreImage, FirestoreImageJsonV1 } from ".";
import { FirestoreDocumentJson } from ".";

export interface FirestoreSponsorJson extends FirestoreDocumentJson {
  link?: string;
  logo?: FirestoreImageJsonV1;
  name?: string;
}

export class FirestoreSponsor {
  link?: string;
  logo?: FirestoreImage;
  name?: string;

  constructor(link?: string, logo?: FirestoreImage, name?: string) {
    if (link != null) {
      this.link = link;
    }
    if (logo != null) {
      this.logo = logo;
    }
    if (name != null) {
      this.name = name;
    }
  }

  static fromJson(json: FirestoreSponsorJson): FirestoreSponsor {
    const returnVal = new FirestoreSponsor();

    if (json.link != null) {
      returnVal.link = json.link;
    }
    if (json.logo != null) {
      returnVal.logo = FirestoreImage.fromJson(json.logo);
    }
    if (json.name != null) {
      returnVal.name = json.name;
    }

    return returnVal;
  }

  toJson(): FirestoreSponsorJson {
    const returnVal: FirestoreSponsorJson = {};

    if (this.link != null) {
      returnVal.link = this.link;
    }
    if (this.logo != null) {
      returnVal.logo = this.logo.toJson();
    }
    if (this.name != null) {
      returnVal.name = this.name;
    }

    return returnVal;
  }

  static isFirestoreSponsorJson(sponsor?: unknown): sponsor is FirestoreSponsorJson {
    if (sponsor == null) {
      return false;
    }

    const {
      link, logo, name
    } = sponsor as Partial<FirestoreSponsorJson>;
    if (link != null && typeof link !== "string") {
      return false;
    }
    if (logo != null && !FirestoreImage.isValidJson(logo)) {
      return false;
    }
    if (name != null && typeof name !== "string") {
      return false;
    }

    return true;
  }
}

export interface DownloadableSponsorJson extends Record<string, AllowedFirestoreTypes> {
  name?: string;
  logo?: DownloadableImageJson;
  link?: string;
}

export class DownloadableSponsor {
  name?: string;
  logo?: DownloadableImage;
  link?: string;

  constructor(link?: DownloadableSponsorJson["link"], logo?: DownloadableSponsorJson["logo"], name?: DownloadableSponsorJson["name"]) {
    if (link != null) {
      this.link = link;
    }
    if (logo != null) {
      this.logo = DownloadableImage.fromJson(logo);
    }
    if (name != null) {
      this.name = name;
    }
  }

  static fromJson(json: DownloadableSponsorJson): DownloadableSponsor {
    return new DownloadableSponsor(json.link, json.logo, json.name);
  }

  toJson(): DownloadableSponsorJson {
    const returnVal: DownloadableSponsorJson = {};

    if (this.link != null) {
      returnVal.link = this.link;
    }
    if (this.logo != null) {
      returnVal.logo = this.logo.toJson();
    }
    if (this.name != null) {
      returnVal.name = this.name;
    }

    return returnVal;
  }

  isDownloadableSponsorJson(sponsor?: unknown): sponsor is DownloadableSponsorJson {
    if (sponsor == null) {
      return false;
    } else if (typeof sponsor !== "object") {
      return false;
    }

    const sponsorJson = sponsor as Partial<DownloadableSponsorJson>;

    if (sponsorJson.link != null && typeof sponsorJson.link !== "string") {
      return false;
    }

    if (sponsorJson.logo != null && !DownloadableImage.isValidJson(sponsorJson.logo)) {
      return false;
    }

    if (sponsorJson.name != null && typeof sponsorJson.name !== "string") {
      return false;
    }

    return true;
  }
}